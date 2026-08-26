import re

for filename in ['src/components/CreatorToolkit.tsx', 'src/pages/DashboardMovieScript.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # In DashboardMovieScript, make sure `auth` is imported if not already.
    # It seems CreatorToolkit imports `auth`. Let's check DashboardMovieScript first.
    
    content = content.replace('user.getIdToken()', 'auth.currentUser?.getIdToken()')

    with open(filename, 'w') as f:
        f.write(content)
