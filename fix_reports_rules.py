import re

with open('firestore.rules', 'r') as f:
    content = f.read()

reports_rule = """
    match /reports/{reportId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
"""

content = content.replace("  }\n}", reports_rule + "  }\n}")

with open('firestore.rules', 'w') as f:
    f.write(content)
