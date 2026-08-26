import re

for filename in ['src/components/CreatorToolkit.tsx', 'src/pages/DashboardMovieScript.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # Clean up imports
    content = content.replace(', secureConsumeCredits, secureRefundCredits', '')
    content = content.replace('secureConsumeCredits,\n', '')
    content = content.replace('secureRefundCredits,\n', '')
    content = content.replace('secureConsumeCredits,', '')
    content = content.replace('secureRefundCredits,', '')

    with open(filename, 'w') as f:
        f.write(content)
