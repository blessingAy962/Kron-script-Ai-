import * as admin from "firebase-admin";

function getFirestoreAdmin() {
  if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountJson) {
      try {
        const secrets = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(secrets)
        });
        console.log("[KRON SERVERLESS] Initialized Firestore Admin using credentials.");
      } catch (e: any) {
        console.error("[KRON SERVERLESS] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", e);
        admin.initializeApp();
      }
    } else {
      console.warn("[KRON SERVERLESS] FIREBASE_SERVICE_ACCOUNT is not defined in environment.");
      // Standard fallback
      admin.initializeApp();
    }
  }
  return admin.firestore();
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    console.log("[WHOP WEBHOOK] Received payload:", rawBody);
    
    const payload = rawBody ? JSON.parse(rawBody) : {};
    
    // Extract userId from metadata parameters securely
    const userId = payload.metadata?.userId || 
                   payload.data?.metadata?.userId || 
                   payload.data?.passthrough || 
                   payload.data?.state ||
                   payload.state ||
                   payload.passport?.userId;

    if (!userId) {
      console.warn("[WHOP WEBHOOK] No userId or state detected in payload.");
      return new Response(JSON.stringify({ error: "Missing userId or state parameters in Whop checkout payload" }), { status: 200, headers });
    }

    let planId = "starter";
    let coinsToAdd = 5000;

    const amount = Number(payload.amount || payload.data?.amount || payload.data?.price || payload.data?.pricing?.amount || payload.payment?.amount);
    const productName = String(payload.product_name || payload.data?.product?.name || payload.data?.plan?.name || "").toLowerCase();

    if (productName.includes("pro") || amount === 12 || amount === 1200) {
      planId = "pro_creator";
      coinsToAdd = 100000;
    } else if (productName.includes("creator") || amount === 6 || amount === 600) {
      planId = "creator";
      coinsToAdd = 25000;
    } else if (productName.includes("starter") || amount === 3 || amount === 300) {
      planId = "starter";
      coinsToAdd = 5000;
    }

    console.log(`[WHOP WEBHOOK] User '${userId}' credited with plan '${planId}' adding ${coinsToAdd} coins.`);

    const firestore = getFirestoreAdmin();
    const userRef = firestore.collection("user_coins").doc(userId);
    
    await firestore.runTransaction(async (transaction) => {
      const sfDoc = await transaction.get(userRef);
      let currentCoins = 150;
      if (sfDoc.exists) {
        currentCoins = sfDoc.data()?.coins ?? 150;
      }
      transaction.set(userRef, {
        coins: currentCoins + coinsToAdd,
        plan: planId,
        plan_status: "active",
        is_premium: true,
        license_acquired_at: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    return new Response(JSON.stringify({ success: true, userId, planId, coinsAdded: coinsToAdd }), { status: 200, headers });
  } catch (error: any) {
    console.error("[WHOP WEBHOOK] Error handling Whop webhook inside Netlify function:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500, headers });
  }
};
