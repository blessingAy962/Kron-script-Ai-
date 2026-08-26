import re

with open('src/pages/DashboardImages.tsx', 'r') as f:
    content = f.read()

pattern = r'body: JSON\.stringify\(\{ prompt, imageType: aspectRatio \}\),'
replacement = r'''body: JSON.stringify({ 
          prompt, imageType: aspectRatio,
          idToken: await auth.currentUser?.getIdToken(),
          cost: 5
        }),'''
content = re.sub(pattern, replacement, content)

with open('src/pages/DashboardImages.tsx', 'w') as f:
    f.write(content)
