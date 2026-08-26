import re

with open('src/pages/DashboardMovieScript.tsx', 'r') as f:
    content = f.read()

# Replace body: JSON.stringify({ title, genre, logline })
pattern = r'body: JSON\.stringify\(\{ title, genre, logline \}\),'
replacement = r'''body: JSON.stringify({ 
          title, genre, logline,
          idToken: await auth.currentUser?.getIdToken(),
          cost: 15
        }),'''
content = re.sub(pattern, replacement, content)

with open('src/pages/DashboardMovieScript.tsx', 'w') as f:
    f.write(content)
