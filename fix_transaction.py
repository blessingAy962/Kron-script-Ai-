import re

with open('server.ts', 'r') as f:
    content = f.read()

bad_transaction_code = """      const planVal = userData.plan || "free";
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
    transaction.update(userRef, { coins: newCoins, updated_at: admin.firestore.FieldValue.serverTimestamp() });"""

fixed_transaction_code = """      const planVal = userData.plan || "free";
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

# Need to also declare updatePayload before the if block
code_before = """    const userDoc = await transaction.get(userRef);
    let currentCoins = 150;
    let userData: any = {};
    const now = Date.now();"""

code_before_fixed = """    const userDoc = await transaction.get(userRef);
    let currentCoins = 150;
    let userData: any = {};
    const now = Date.now();
    let updatePayload: any = {};"""

content = content.replace(code_before, code_before_fixed)
content = content.replace(bad_transaction_code, fixed_transaction_code)

with open('server.ts', 'w') as f:
    f.write(content)

