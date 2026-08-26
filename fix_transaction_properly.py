import re

with open('server.ts', 'r') as f:
    content = f.read()

bad_transaction_code = """      currentCoins = isAdminEmail ? 150000 : 150;
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
        updatePayload.last_reset_time = now;
      } else if (shouldReset) {
        updatePayload.last_reset_time = now;
      }
    }

    if (currentCoins < costNum) {
      throw new Error(`Insufficient credits. Need ${costNum} but have ${currentCoins}.`);
    }

    const newCoins = currentCoins - costNum;
    updatePayload.coins = newCoins;
    updatePayload.updated_at = admin.firestore.FieldValue.serverTimestamp();
    
    if (Object.keys(updatePayload).length > 0) {
      transaction.update(userRef, updatePayload);
    }"""

fixed_transaction_code = """      currentCoins = isAdminEmail ? 150000 : 150;
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
        updatePayload.last_reset_time = now;
      } else if (shouldReset) {
        updatePayload.last_reset_time = now;
      }
    }

    if (currentCoins < costNum) {
      throw new Error(`Insufficient credits. Need ${costNum} but have ${currentCoins}.`);
    }

    const newCoins = currentCoins - costNum;
    
    if (!userDoc.exists) {
      userData.coins = newCoins;
      transaction.set(userRef, userData);
    } else {
      updatePayload.coins = newCoins;
      updatePayload.updated_at = admin.firestore.FieldValue.serverTimestamp();
      transaction.update(userRef, updatePayload);
    }"""

content = content.replace(bad_transaction_code, fixed_transaction_code)

with open('server.ts', 'w') as f:
    f.write(content)

