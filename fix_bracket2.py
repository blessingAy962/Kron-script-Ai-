with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("    return transactionId;\n  });\n}\n}\n\n// Endpoint: Consume Credits", "    return transactionId;\n  });\n}\n\n// Endpoint: Consume Credits")

with open('server.ts', 'w') as f:
    f.write(content)
