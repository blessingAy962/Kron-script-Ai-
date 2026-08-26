import re

with open('src/components/CreatorToolkit.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const consumeCredits = async \(cost: number\) => \{\s*return secureConsumeCredits\(cost\);\s*\};\s*', '', content)
content = re.sub(r'const refundCredits = async \(transactionId: string, cost\?: number\) => \{\s*return secureRefundCredits\(transactionId, cost\);\s*\};\s*', '', content)

with open('src/components/CreatorToolkit.tsx', 'w') as f:
    f.write(content)
