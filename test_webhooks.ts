import * as crypto from "crypto";

// --- IN-MEMORY DATABASE MOCK ---
const mockDb: Record<string, any> = {};

const mockTransaction = {
  get: async (ref: any) => {
    const data = mockDb[ref.path];
    return {
      exists: data !== undefined,
      data: () => data
    };
  },
  set: (ref: any, data: any, options?: any) => {
    if (options?.merge) {
      mockDb[ref.path] = { ...mockDb[ref.path], ...data };
    } else {
      mockDb[ref.path] = data;
    }
  }
};

let transactionQueue = Promise.resolve();

const mockFirestore = {
  collection: (colName: string) => ({
    doc: (docId: string) => ({
      path: `${colName}/${docId}`,
      get: async () => {
        const data = mockDb[`${colName}/${docId}`];
        return { exists: data !== undefined, data: () => data };
      }
    })
  }),
  runTransaction: async (callback: any) => {
    const resultPromise = transactionQueue.then(async () => {
      return callback(mockTransaction);
    });
    transactionQueue = resultPromise.then(() => {}, () => {}); // Prevent failures from blocking future runs
    return resultPromise;
  }
};

// --- CORE VERIFICATION & FULFILLMENT ENGINE TO BE TESTED ---
// This is a precise match of the logic we wrote in `/netlify/functions/whop-webhook.ts`
const TRUSTED_PLANS = {
  "starter": { planId: "starter", coinsToAdd: 5000 },
  "creator": { planId: "creator", coinsToAdd: 25000 },
  "pro-creator": { planId: "pro_creator", coinsToAdd: 100000 },
  "pro_creator": { planId: "pro_creator", coinsToAdd: 100000 }
};

async function testWebhookHandler(
  req: { method: string; text: () => Promise<string>; headers: Record<string, string> },
  envSecret = "whsec_testsecret123abc456def789ghi"
) {
  const headers = { "Content-Type": "application/json" };

  if (req.method !== "POST") {
    return { status: 405, json: async () => ({ error: "Method not allowed" }) };
  }

  try {
    const rawBody = await req.text();

    // 1. Signature & Replay Protection Verification
    const webhookId = req.headers["webhook-id"] || req.headers["Webhook-Id"] || "";
    const webhookTimestamp = req.headers["webhook-timestamp"] || req.headers["Webhook-Timestamp"] || "";
    const webhookSignature = req.headers["webhook-signature"] || req.headers["Webhook-Signature"] || "";

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      return { status: 401, json: async () => ({ error: "Missing webhook headers" }) };
    }

    // Timestamp verification (replay protection - 5 minutes)
    const nowSecs = Math.floor(Date.now() / 1000);
    const timestampNum = parseInt(webhookTimestamp, 10);
    if (isNaN(timestampNum) || Math.abs(nowSecs - timestampNum) > 5 * 60) {
      return { status: 401, json: async () => ({ error: "Timestamp is stale or invalid" }) };
    }

    // Signature verification using Whop Webhook Secret
    const webhookSecret = envSecret;
    if (!webhookSecret) {
      return { status: 500, json: async () => ({ error: "Server misconfiguration" }) };
    }

    try {
      const cleanSecret = webhookSecret.replace(/^whsec_/, "");
      const secretBuffer = Buffer.from(cleanSecret, "base64");
      const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
      const hmac = crypto.createHmac("sha256", secretBuffer);
      hmac.update(signedContent);
      const expectedSignature = hmac.digest("base64");

      // Verify matching signature
      const passedSignatures = webhookSignature.split(" ");
      let verified = false;
      for (const sig of passedSignatures) {
        const parts = sig.split(",");
        if (parts.length === 2 && parts[0] === "v1") {
          const receivedSig = parts[1];
          const expectedBuffer = Buffer.from(expectedSignature, "base64");
          const receivedBuffer = Buffer.from(receivedSig, "base64");
          if (expectedBuffer.length === receivedBuffer.length) {
            if (crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
              verified = true;
              break;
            }
          }
        }
      }

      if (!verified) {
        return { status: 401, json: async () => ({ error: "Invalid webhook signature" }) };
      }
    } catch (sigErr) {
      return { status: 401, json: async () => ({ error: "Invalid signature payload" }) };
    }

    // 2. Parse payload safely
    const payload = rawBody ? JSON.parse(rawBody) : {};

    // 3. Process only intended verified event types
    const action = (payload.action || "").toString().toLowerCase();
    const isTargetEvent = action === "payment.succeeded" || action === "membership.went_valid" || action === "membership.activated" || action === "test.event";
    if (!isTargetEvent) {
      return { status: 200, json: async () => ({ success: true, message: "Event type ignored" }) };
    }

    // 4. Derive the application user identity securely from verified event's metadata
    const userId = payload.metadata?.userId || 
                   payload.data?.metadata?.userId || 
                   payload.data?.passthrough || 
                   payload.data?.state ||
                   payload.state ||
                   payload.passport?.userId;

    if (!userId) {
      return { status: 400, json: async () => ({ error: "Missing userId in payload metadata" }) };
    }

    // 5. Validate the payment/plan against server-owned allowlist of real Whop plan IDs
    const rawPlanIdentifier = (
      payload.plan_id ||
      payload.plan?.id ||
      payload.data?.plan_id ||
      payload.data?.plan?.id ||
      payload.data?.plan?.slug ||
      payload.data?.product_id ||
      payload.data?.product?.id ||
      payload.data?.product?.slug ||
      payload.product_id ||
      ""
    ).toString().toLowerCase().trim();

    let matchedPlan = (TRUSTED_PLANS as any)[rawPlanIdentifier];

    // Safe fallback check inside allowlist keys using name patterns
    if (!matchedPlan) {
      const productName = (
        payload.product_name || 
        payload.data?.product?.name || 
        payload.data?.plan?.name || 
        ""
      ).toString().toLowerCase();

      if (productName.includes("pro-creator") || productName.includes("pro_creator") || productName.includes("pro creator")) {
        matchedPlan = TRUSTED_PLANS["pro-creator"];
      } else if (productName.includes("creator")) {
        matchedPlan = TRUSTED_PLANS["creator"];
      } else if (productName.includes("starter")) {
        matchedPlan = TRUSTED_PLANS["starter"];
      }
    }

    if (!matchedPlan) {
      return { status: 400, json: async () => ({ error: "Untrusted or invalid plan identifier" }) };
    }

    const { planId, coinsToAdd } = matchedPlan;

    // 6. Make fulfillment idempotent and concurrency-safe using Firestore Transaction Mock
    const webhookRef = { path: `processed_webhooks/${webhookId}` };
    const userRef = { path: `user_coins/${userId}` };

    const transactionResult = await mockFirestore.runTransaction(async (transaction) => {
      const webhookDoc = await transaction.get(webhookRef);
      if (webhookDoc.exists) {
        return { alreadyProcessed: true };
      }

      const userDoc = await transaction.get(userRef);
      let currentCoins = 150;
      if (userDoc.exists) {
        currentCoins = userDoc.data()?.coins ?? 150;
      }

      // Atomically mark webhook as processed
      transaction.set(webhookRef, {
        processed_at: new Date(),
        userId,
        planId,
        coinsAdded: coinsToAdd
      });

      // Grant entitlement securely
      transaction.set(userRef, {
        coins: currentCoins + coinsToAdd,
        plan: planId,
        plan_status: "active",
        is_premium: true,
        license_acquired_at: new Date()
      }, { merge: true });

      return { alreadyProcessed: false };
    });

    if (transactionResult.alreadyProcessed) {
      return { status: 200, json: async () => ({ success: true, duplicated: true, message: "Webhook already processed" }) };
    }

    return { status: 200, json: async () => ({ success: true, userId, planId, coinsAdded: coinsToAdd }) };
  } catch (error: any) {
    return { status: 500, json: async () => ({ error: "Internal Server Error" }) };
  }
}

// --- TEST ENVIRONMENT SETUP ---
const TEST_SECRET = "whsec_testsecret123abc456def789ghi";

// Helper to compute Svix signature header
function generateWhopHeaders(webhookId: string, timestamp: number, body: string, secret = TEST_SECRET) {
  const cleanSecret = secret.replace(/^whsec_/, "");
  const secretBuffer = Buffer.from(cleanSecret, "base64");
  const signedContent = `${webhookId}.${timestamp}.${body}`;
  const hmac = crypto.createHmac("sha256", secretBuffer);
  hmac.update(signedContent);
  const signatureValue = hmac.digest("base64");

  return {
    "webhook-id": webhookId,
    "webhook-timestamp": timestamp.toString(),
    "webhook-signature": `v1,${signatureValue}`
  };
}

// Mock Request Constructor
function createMockRequest(body: string, headers: Record<string, string>) {
  return {
    method: "POST",
    headers,
    text: async () => body
  };
}

// Assertion Helpers
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(` PASS: ${message}`);
}

async function runTests() {
  console.log("=========================================");
  console.log("KRON SCRIPT AI - WHOP WEBHOOK REGRESSION TESTS");
  console.log("=========================================\n");

  const userId = "test_user_789";

  // Reset database
  for (const key in mockDb) delete mockDb[key];

  // -------------------------------------------------------------
  // Test Case 1: Valid event & fulfillment
  // -------------------------------------------------------------
  {
    const webhookId = "evt_001_valid";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyObj = {
      action: "payment.succeeded",
      plan_id: "starter",
      metadata: { userId }
    };
    const bodyStr = JSON.stringify(bodyObj);
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);
    const req = createMockRequest(bodyStr, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 200, "Valid event returns 200");
    const json = (await res.json()) as any;
    assert(json.success === true, "Valid event response has success: true");
    assert(json.coinsAdded === 5000, "Valid starter event credits 5000 coins");

    // Verify database state
    const userCoins = mockDb[`user_coins/${userId}`];
    assert(userCoins !== undefined, "User coins document created in database");
    assert(userCoins.coins === 5150, "User coins credited correctly (150 baseline + 5000 added)");
    assert(userCoins.plan === "starter", "User plan set correctly to starter");
  }

  // -------------------------------------------------------------
  // Test Case 2: Modified body detection (signature verification fails)
  // -------------------------------------------------------------
  {
    const webhookId = "evt_002_modified";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyObj = {
      action: "payment.succeeded",
      plan_id: "starter",
      metadata: { userId }
    };
    const bodyStr = JSON.stringify(bodyObj);
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);

    // Tamper with the body content
    const tamperedBody = bodyStr.replace("starter", "pro_creator");
    const req = createMockRequest(tamperedBody, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 401, "Modified body rejected with 401 Unauthorized");
  }

  // -------------------------------------------------------------
  // Test Case 3: Invalid signature
  // -------------------------------------------------------------
  {
    const webhookId = "evt_003_badsig";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyStr = JSON.stringify({ action: "payment.succeeded", plan_id: "starter" });
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr, "whsec_wrongsecret123456789");
    const req = createMockRequest(bodyStr, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 401, "Invalid signature rejected with 401");
  }

  // -------------------------------------------------------------
  // Test Case 4: Missing headers
  // -------------------------------------------------------------
  {
    const bodyStr = JSON.stringify({ action: "payment.succeeded", plan_id: "starter" });
    const req = createMockRequest(bodyStr, {}); // No signature headers at all

    const res = await testWebhookHandler(req);
    assert(res.status === 401, "Missing headers rejected with 401");
  }

  // -------------------------------------------------------------
  // Test Case 5: Stale timestamp (replay attack prevention)
  // -------------------------------------------------------------
  {
    const webhookId = "evt_005_stale";
    const timestamp = Math.floor(Date.now() / 1000) - 10 * 60; // 10 minutes ago (outside 5-minute window)
    const bodyStr = JSON.stringify({ action: "payment.succeeded", plan_id: "starter", metadata: { userId } });
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);
    const req = createMockRequest(bodyStr, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 401, "Stale timestamp (> 5 mins) rejected with 401");
  }

  // -------------------------------------------------------------
  // Test Case 6: Unknown or untrusted plan
  // -------------------------------------------------------------
  {
    const webhookId = "evt_006_badplan";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyStr = JSON.stringify({ action: "payment.succeeded", plan_id: "untrusted-plan-999", metadata: { userId } });
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);
    const req = createMockRequest(bodyStr, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 400, "Untrusted plan rejected with 400 Bad Request");
  }

  // -------------------------------------------------------------
  // Test Case 7: Missing user identity
  // -------------------------------------------------------------
  {
    const webhookId = "evt_007_missinguser";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyStr = JSON.stringify({ action: "payment.succeeded", plan_id: "starter", metadata: {} }); // Empty metadata
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);
    const req = createMockRequest(bodyStr, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 400, "Missing user identity rejected with 400");
  }

  // -------------------------------------------------------------
  // Test Case 8: Irrelevant event type
  // -------------------------------------------------------------
  {
    const webhookId = "evt_008_irrelevant";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyStr = JSON.stringify({ action: "membership.cancelled", plan_id: "starter", metadata: { userId } });
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);
    const req = createMockRequest(bodyStr, headers);

    const res = await testWebhookHandler(req);
    assert(res.status === 200, "Irrelevant event returns 200 OK without processing");
    const json = (await res.json()) as any;
    assert(json.message === "Event type ignored", "Response indicates event ignored");
  }

  // -------------------------------------------------------------
  // Test Case 9: Repeated webhook ID (Idempotency check)
  // -------------------------------------------------------------
  {
    const webhookId = "evt_009_idempotency";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyObj = {
      action: "payment.succeeded",
      plan_id: "starter",
      metadata: { userId }
    };
    const bodyStr = JSON.stringify(bodyObj);
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);
    const req = createMockRequest(bodyStr, headers);

    // Initial delivery
    const res1 = await testWebhookHandler(req);
    assert(res1.status === 200, "First delivery succeeds (200)");
    
    // Check baseline credited amount (5150 + 5000 = 10150)
    assert(mockDb[`user_coins/${userId}`].coins === 10150, "Coins credited once");

    // Second delivery (duplicate replay)
    const req2 = createMockRequest(bodyStr, headers);
    const res2 = await testWebhookHandler(req2);
    assert(res2.status === 200, "Second delivery returns 200");
    const json2 = (await res2.json()) as any;
    assert(json2.duplicated === true, "Second delivery recognized as duplicate");
    assert(mockDb[`user_coins/${userId}`].coins === 10150, "Coins remained the same (not double credited)");
  }

  // -------------------------------------------------------------
  // Test Case 10: Concurrent duplicate delivery
  // -------------------------------------------------------------
  {
    const webhookId = "evt_010_concurrent";
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyObj = {
      action: "payment.succeeded",
      plan_id: "pro_creator",
      metadata: { userId }
    };
    const bodyStr = JSON.stringify(bodyObj);
    const headers = generateWhopHeaders(webhookId, timestamp, bodyStr);

    // Launch both concurrently
    const p1 = testWebhookHandler(createMockRequest(bodyStr, headers));
    const p2 = testWebhookHandler(createMockRequest(bodyStr, headers));

    const [r1, r2] = await Promise.all([p1, p2]);
    const j1 = (await r1.json()) as any;
    const j2 = (await r2.json()) as any;

    assert(r1.status === 200 && r2.status === 200, "Both concurrent handlers finished with 200");
    assert((j1.duplicated || j2.duplicated) && !(j1.duplicated && j2.duplicated), "Exactly one concurrent handler flagged a duplicate");
  }

  console.log("\n=========================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  console.log("=========================================");
}

runTests().catch(err => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
