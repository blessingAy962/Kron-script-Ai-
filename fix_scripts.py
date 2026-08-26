import re

with open('src/pages/DashboardScripts.tsx', 'r') as f:
    content = f.read()

pattern = r'body: JSON\.stringify\(\{ topic, style: selectedStyle \}\),'
replacement = r'''body: JSON.stringify({ 
          topic, style: selectedStyle,
          idToken: await auth.currentUser?.getIdToken(),
          cost: 10
        }),'''
content = re.sub(pattern, replacement, content)

with open('src/pages/DashboardScripts.tsx', 'w') as f:
    f.write(content)
