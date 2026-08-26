import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add consumeUserCredits helper before the first endpoint
helper_func = """
// Helper to consume credits and perform daily reset
async function consumeUserCredits(idToken: string, cost: number, description: string = "AI feature usage"): Promise<string> {
  if (!idToken || !cost) return "";
  const { uid, email } = await verifyUser(idToken);
  const costNum = Number(cost);
  if (isNaN(costNum) || costNum < 1 || costNum > 10000 || !Number.isInteger(costNum)) {
    throw new Error("Invalid consumption cost");
  }

  const userRef = adminDb.collection("user_coins").doc(uid);
  const transactionId = "tx_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  const txRef = adminDb.collection("user_transactions").doc(transactionId);

  return await adminDb.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    let currentCoins = 150;
    let userData: any = {};
    const now = Date.now();

    if (!userDoc.exists) {
      const isAdminEmail = email === "starbruce91@gmail.com";
      currentCoins = isAdminEmail ? 150000 : 150;
      userData = {
        id: uid,
        user_id: uid,
        coins: currentCoins,
        plan: isAdminEmail ? "pro_creator" : "free",
        plan_status: "active",
        last_reset_time: now,
        referral_count: 0,
        referred_emails: [],
        is_admin: isAdminEmail,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      };
      transaction.set(userRef, userData);
    } else {
      userData = userDoc.data() || {};
      currentCoins = userData.coins ?? 150;
      
      const lastReset = userData.last_reset_time;
      let shouldReset = false;
      if (!lastReset) {
        shouldReset = true;
      } else {
        const lastResetMs = typeof lastReset === "number" ? lastReset : (lastReset.toMillis ? lastReset.toMillis() : new Date(lastReset).getTime());
        if (now - lastResetMs >= 24 * 60 * 60 * 1000) {
          shouldReset = true;
        }
      }
      
      const planVal = userData.plan || "free";
      if (shouldReset && planVal === "free") {
        currentCoins = 150; 
        transaction.update(userRef, { coins: 150, last_reset_time: now });
      } else if (shouldReset) {
        transaction.update(userRef, { last_reset_time: now });
      }
    }

    if (currentCoins < costNum) {
      throw new Error(`Insufficient credits. Need ${costNum} but have ${currentCoins}.`);
    }

    const newCoins = currentCoins - costNum;
    transaction.update(userRef, { coins: newCoins, updated_at: admin.firestore.FieldValue.serverTimestamp() });

    transaction.set(txRef, {
      id: transactionId,
      user_id: uid,
      amount: -costNum,
      type: "consume",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: description
    });

    return transactionId;
  });
}
"""

# Insert right after verifyUser function
content = re.sub(r'(async function verifyUser.*?\}\n)', r'\1\n' + helper_func, content, count=1, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(content)

