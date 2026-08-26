import re

with open('src/pages/DashboardMovieScript.tsx', 'r') as f:
    content = f.read()

# Replace the specific hardcoded error throw
pattern = r'if \(!resp\.ok\) \{\s*throw new Error\("Veo 3\.1 API engine offline or busy\. Coins refunded\."\);\s*\}'
replacement = r'''if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Veo 3.1 API engine offline or busy.");
      }'''

content = re.sub(pattern, replacement, content)

with open('src/pages/DashboardMovieScript.tsx', 'w') as f:
    f.write(content)

