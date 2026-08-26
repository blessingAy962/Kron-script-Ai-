import re

with open('src/pages/DashboardMovieScript.tsx', 'r') as f:
    content = f.read()

# 1. Update fetch payloads to include idToken and cost
def inject_auth(match):
    body_content = match.group(1)
    return 'body: JSON.stringify({\n          idToken: await user.getIdToken(),\n          cost: cost,\n' + body_content

content = re.sub(r'body:\s*JSON\.stringify\(\{\n(.*?)\}\)', inject_auth, content, flags=re.DOTALL)

# 2. Remove all `secureConsumeCredits` blocks
content = re.sub(r'let transactionId = "";\s*try \{\s*// 1\. Deduct coins via secure client-side transaction with fallback\s*transactionId = await secureConsumeCredits\(cost\);\s*', 'try {\n', content, flags=re.DOTALL)

# 3. Remove all `secureRefundCredits` blocks
content = re.sub(r'// Rollback coins on failure via secure client-side transaction with fallback\s*if \(transactionId\) \{\s*await secureRefundCredits\(transactionId, cost\)\.catch\(err => console\.warn\("Refund failed:", err\)\);\s*\}\s*', '', content, flags=re.DOTALL)


with open('src/pages/DashboardMovieScript.tsx', 'w') as f:
    f.write(content)
