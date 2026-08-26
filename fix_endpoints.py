import re

with open('server.ts', 'r') as f:
    content = f.read()

endpoints = [
    ("prompt-maker", "AI Prompt Maker"),
    ("generate-movie-script", "Movie Script Generation"),
    ("script-caption-architect", "Caption Architect"),
    ("detect-ai-deepfake", "Deepfake Detection"),
    ("analyze-dropped-video", "Video Retention Analysis"),
    ("predictive-thumbnail-tester", "Predictive Thumbnail"),
    ("generate-video", "AI Video Generation")
]

for endpoint, feature_desc in endpoints:
    pattern = rf'(app\.post\("/api/{endpoint}", async \(req, res\) => {{\n\s*try {{\n)'
    # Some endpoints have `const { ... } = req.body || {};` BEFORE try block.
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
