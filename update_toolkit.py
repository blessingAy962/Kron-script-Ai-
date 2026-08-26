import re

with open('src/components/CreatorToolkit.tsx', 'r') as f:
    content = f.read()

# 1. Update fetch payloads to include idToken and cost
def inject_auth(match):
    body_content = match.group(1)
    return 'body: JSON.stringify({\n          idToken: await user.getIdToken(),\n          cost: cost,\n' + body_content

content = re.sub(r'body:\s*JSON\.stringify\(\{\n(.*?)\}\)', inject_auth, content, flags=re.DOTALL)

# 2. Remove all `consumeCredits` blocks
content = re.sub(r'// 1\. Deduct dynamic coins via secure server-side transaction.*?txId = "";\s*try \{.*?\} catch \(consumeErr: any\) \{.*?return;\s*\}\s*', '', content, flags=re.DOTALL)
content = re.sub(r'let txId = "";\s*try \{\s*txId = await consumeCredits\(cost\);\s*\} catch \(consumeErr: any\) \{\s*toast\.error.*?return;\s*\}\s*', '', content, flags=re.DOTALL)

# 3. Remove all `refundCredits` blocks
content = re.sub(r'// Safe refund via secure server-side transaction\s*if \(txId\) \{\s*await refundCredits\(txId, cost\);\s*\}\s*', '', content, flags=re.DOTALL)

# 4. Remove client-side history saving for prompts
history_pattern_prompt = r'// Save generated prompts to secure user history.*?try \{.*?handleFirestoreError\(dbSaveErr, OperationType\.CREATE, "scripts"\);\s*\}\s*'
content = re.sub(history_pattern_prompt, '', content, flags=re.DOTALL)

# Remove client-side history saving for movie scripts
history_pattern_script = r'// Save generated script to secure user history.*?try \{.*?handleFirestoreError\(dbSaveErr, OperationType\.CREATE, "scripts"\);\s*\}\s*'
content = re.sub(history_pattern_script, '', content, flags=re.DOTALL)

# Remove client-side history saving for captions
history_pattern_captions = r'// Save generated captions to secure user history.*?try \{.*?handleFirestoreError\(dbSaveErr, OperationType\.CREATE, "scripts"\);\s*\}\s*'
content = re.sub(history_pattern_captions, '', content, flags=re.DOTALL)


with open('src/components/CreatorToolkit.tsx', 'w') as f:
    f.write(content)
