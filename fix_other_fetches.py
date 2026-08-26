import re

with open('src/components/CreatorToolkit.tsx', 'r') as f:
    content = f.read()

# Fix 1: predictive-thumbnail-tester
content = re.sub(
    r'body: JSON\.stringify\(\{ media: thumbImage, mimeType: "image/png" \}\)',
    r'body: JSON.stringify({ idToken: await user.getIdToken(), cost: cost, media: thumbImage, mimeType: "image/png" })',
    content
)

# Fix 2: analyze-dropped-video
content = re.sub(
    r'body: JSON\.stringify\(\{ videoFile, videoName \}\)',
    r'body: JSON.stringify({ idToken: await user.getIdToken(), cost: cost, videoFile, videoName })',
    content
)

# Fix 3: detect-ai-deepfake
content = re.sub(
    r'body: JSON\.stringify\(\{ media: detectorFile, mimeType: detectorMimeType \}\)',
    r'body: JSON.stringify({ idToken: await user.getIdToken(), cost: cost, media: detectorFile, mimeType: detectorMimeType })',
    content
)

with open('src/components/CreatorToolkit.tsx', 'w') as f:
    f.write(content)
