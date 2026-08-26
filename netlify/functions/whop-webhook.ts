import * as admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

let firebaseProjectId = "gen-lang-client-0666906949";
let firebaseDatabaseId = "ai-studio-d937aa55-d9b3-4946-a19e-a80fd986d103";

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (config.projectId) firebaseProjectId = config.projectId;
    if (config.firestoreDatabaseId) firebaseDatabaseId = config.firestoreDatabaseId;
  }
} catch (err) {
  console.warn("[KRON SERVERLESS] Failed to load firebase-applet-config.json in whop-webhook:", err);
}

// Allowed server-side plan definitions
interface WhopPlanConfig {
  planId: string;
  coinsToAdd: number;
}

const TRUSTED_PLANS: Record<string, WhopPlanConfig> = {
  "starter": { planId: "starter", coinsToAdd: 5000 },
  "creator": { planId: "creator", coinsToAdd: 25000 },
  "pro-creator": { planId: "pro_creator", coinsToAdd: 100000 },
  "pro_creator": { planId: "pro_creator", coinsToAdd: 100000 }
};

function getFirestoreAdmin() {
  if (!(admin.apps || []).length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountJson) {
      try {
        const secrets = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(secrets),
          projectId: firebaseProjectId
        });
        console.log("[KRON SERVERLESS] Initialized Firestore Admin using credentials.");
      } catch (e: any) {
        console.error("[KRON SERVERLESS] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", e);
        admin.initializeApp({
          projectId: firebaseProjectId
        });
      }
    } else {
      console.warn("[KRON SERVERLESS] FIREBASE_SERVICE_ACCOUNT is not defined in environment.");
      // Standard fallback
      admin.initializeApp({
        projectId: firebaseProjectId
      });
    }
  }
  return getFirestore(firebaseDatabaseId);
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, webhook-id, webhook-timestamp, webhook-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  try {
    const rawBody = await req.text();

    // 1. Signature & Replay Protection Verification
    const webhookId = req.headers.get("webhook-id") || req.headers.get("Webhook-Id") || "";
    const webhookTimestamp = req.headers.get("webhook-timestamp") || req.headers.get("Webhook-Timestamp") || "";
    const webhookSignature = req.headers.get("webhook-signature") || req.headers.get("Webhook-Signature") || "";

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      console.warn("[WHOP WEBHOOK] Missing signature headers.");
      return new Response(JSON.stringify({ error: "Missing webhook headers" }), { status: 401, headers });
    }

    // Timestamp verification (replay protection - 5 minutes)
    const nowSecs = Math.floor(Date.now() / 1000);
    const timestampNum = parseInt(webhookTimestamp, 10);
    if (isNaN(timestampNum) || Math.abs(nowSecs - timestampNum) > 5 * 60) {
      console.warn(`[WHOP WEBHOOK] Rejected: Stale webhook timestamp (${webhookTimestamp}).`);
      return new Response(JSON.stringify({ error: "Timestamp is stale or invalid" }), { status: 401, headers });
    }

    // Signature verification using Whop Webhook Secret
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[WHOP WEBHOOK] WHOP_WEBHOOK_SECRET is not configured in the server environment variables.");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), { status: 500, headers });
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
        console.warn("[WHOP WEBHOOK] Invalid webhook signature detected.");
        return new Response(JSON.stringify({ error: "Invalid webhook signature" }), { status: 401, headers });
      }
    } catch (sigErr) {
      console.error("[WHOP WEBHOOK] Exception during signature computation:", sigErr);
      return new Response(JSON.stringify({ error: "Invalid signature payload" }), { status: 401, headers });
    }

    // 2. Parse payload safely
    const payload = rawBody ? JSON.parse(rawBody) : {};

    // 3. Process only intended verified event types
    const action = (payload.action || "").toString().toLowerCase();
    const isTargetEvent = action === "payment.succeeded" || action === "membership.went_valid" || action === "membership.activated" || action === "test.event";
    if (!isTargetEvent) {
      console.log(`[WHOP WEBHOOK] Ignored irrelevant webhook action: '${action}'`);
      return new Response(JSON.stringify({ success: true, message: "Event type ignored" }), { status: 200, headers });
    }

    // 4. Derive the application user identity securely from verified event's metadata
    const userId = payload.metadata?.userId || 
                   payload.data?.metadata?.userId || 
                   payload.data?.passthrough || 
                   payload.data?.state ||
                   payload.state ||
                   payload.passport?.userId;

    if (!userId) {
      console.warn("[WHOP WEBHOOK] No userId detected in verified event metadata.");
      return new Response(JSON.stringify({ error: "Missing userId in payload metadata" }), { status: 400, headers });
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

    let matchedPlan = TRUSTED_PLANS[rawPlanIdentifier];

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
      console.warn(`[WHOP WEBHOOK] Rejected webhook: Plan/Product identifier '${rawPlanIdentifier}' not found in trusted plans allowlist.`);
      return new Response(JSON.stringify({ error: "Untrusted or invalid plan identifier" }), { status: 400, headers });
    }

    const { planId, coinsToAdd } = matchedPlan;

    // 6. Make fulfillment idempotent and concurrency-safe using Firestore Transaction
    const firestore = getFirestoreAdmin();
    const webhookRef = firestore.collection("processed_webhooks").doc(webhookId);
    const userRef = firestore.collection("user_coins").doc(userId);

    const transactionResult = await firestore.runTransaction(async (transaction) => {
      const webhookDoc = await transaction.get(webhookRef);
      if (webhookDoc.exists) {
        return { alreadyProcessed: true };
      }

      const userDoc = await transaction.get(userRef);
      let currentCoins = 150;
      if (userDoc.exists) {
        currentCoins = userDoc.data()?.coins ?? 150;
      }

      // Atomically mark webhook as processed to prevent replay/duplicate deliveries
      transaction.set(webhookRef, {
        processed_at: FieldValue.serverTimestamp(),
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
        license_acquired_at: FieldValue.serverTimestamp()
      }, { merge: true });

      return { alreadyProcessed: false };
    });

    if (transactionResult.alreadyProcessed) {
      console.log(`[WHOP WEBHOOK] Idempotency hit: Webhook '${webhookId}' already handled.`);
      return new Response(JSON.stringify({ success: true, duplicated: true, message: "Webhook already processed" }), { status: 200, headers });
    }

    // Log only safe operational metadata, preserving user privacy and API credentials
    console.log(`[WHOP WEBHOOK] Processed ID '${webhookId}' for user '${userId}', credited plan '${planId}' adding ${coinsToAdd} coins.`);

    return new Response(JSON.stringify({ success: true, userId, planId, coinsAdded: coinsToAdd }), { status: 200, headers });
  } catch (error: any) {
    console.error("[WHOP WEBHOOK] Exception inside Netlify webhook handler:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers });
  }
};
