import re

with open('src/components/CreatorToolkit.tsx', 'r') as f:
    content = f.read()

# Fix prompt-maker
content = re.sub(
    r'(mimeTypeVideo: computedVideoMime\s*)\n\s*\}\);',
    r'\1\n        })\n      });',
    content
)

# Fix generate-movie-script
content = re.sub(
    r'(description: scriptDescription\s*)\n\s*\}\);',
    r'\1\n        })\n      });',
    content
)

# Fix script-caption-architect
content = re.sub(
    r'(wordCount: captionWordCount\s*),\n\s*\}\);',
    r'\1\n        })\n      });',
    content
)


with open('src/components/CreatorToolkit.tsx', 'w') as f:
    f.write(content)
