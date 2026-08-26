with open('server.ts', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if line.startswith('// Helper to consume credits and perform daily reset'):
        start_idx = i
    elif line.startswith('// Endpoint: Consume Credits'):
        end_idx = i - 6 # Need to capture up to } of verifyUser

# The block to extract is from start_idx to the line before `      }\n    } catch (decodeError: any) {`
# Let's find exactly the line: `  });\n}`
block_end_idx = -1
for i in range(start_idx, len(lines)):
    if lines[i] == '  });\n' and lines[i+1] == '}\n':
        block_end_idx = i + 1
        break

extracted = lines[start_idx:block_end_idx+1]
rest_of_verify = lines[block_end_idx+1:end_idx] # wait, no

del lines[start_idx:block_end_idx+1]

# find where verifyUser ends now
verify_end_idx = -1
for i in range(start_idx-5, len(lines)):
    if lines[i] == '  }\n' and lines[i-1].strip().startswith('throw verifyError'):
        verify_end_idx = i
        break

lines.insert(verify_end_idx + 1, '\n' + ''.join(extracted) + '\n')

with open('server.ts', 'w') as f:
    f.writelines(lines)
