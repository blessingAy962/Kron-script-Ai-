import re

with open('src/pages/DashboardMovieScript.tsx', 'r') as f:
    content = f.read()

# Fix json closure
content = re.sub(
    r'(aspectRatio: videoAspectRatio,\s*),\n\s*\}\);',
    r'\1\n        })\n      });',
    content
)

with open('src/pages/DashboardMovieScript.tsx', 'w') as f:
    f.write(content)
