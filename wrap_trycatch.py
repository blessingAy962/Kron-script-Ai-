import re

with open('src/pages/DashboardMovieScript.tsx', 'r') as f:
    content = f.read()

pattern = r'''      // Update script metrics on the user_coins document to track the daily quotas
      const coinsRef = doc\(db, "user_coins", user.uid\);
      const nextCount = shouldResetCount \? 1 : \(currentCount \+ 1\);
      await setDoc\(coinsRef, \{
        scripts_today_count: nextCount,
        last_script_generate_time: now,
      \}, \{ merge: true \}\);'''

replacement = r'''      // Update script metrics on the user_coins document to track the daily quotas
      try {
        const coinsRef = doc(db, "user_coins", user.uid);
        const nextCount = shouldResetCount ? 1 : (currentCount + 1);
        await setDoc(coinsRef, {
          scripts_today_count: nextCount,
          last_script_generate_time: now,
        }, { merge: true });
      } catch (metricsErr) {
        console.warn("Failed to update script metrics locally:", metricsErr);
      }'''

content = re.sub(pattern, replacement, content)

with open('src/pages/DashboardMovieScript.tsx', 'w') as f:
    f.write(content)
