import re

with open('server.ts', 'r') as f:
    content = f.read()

endpoints = [
    ("generate-image", "Image Generation"),
    ("generate-script", "Script Generation")
]

for endpoint, feature_desc in endpoints:
    pattern_alt = rf'(app\.post\("/api/{endpoint}", async \(req, res\) => {{\n.*?\s*try {{\n)'
    
    match = re.search(pattern_alt, content)
    if match:
        injection = f"""
    if (req.body.idToken && req.body.cost) {{
      try {{
        await consumeUserCredits(req.body.idToken, req.body.cost, "{feature_desc}");
      }} catch (creditErr: any) {{
        return res.status(402).json({{ error: creditErr.message || "Insufficient credits" }});
      }}
    }}
"""
        # Insert injection after the match
        content = content[:match.end()] + injection + content[match.end():]

with open('server.ts', 'w') as f:
    f.write(content)
