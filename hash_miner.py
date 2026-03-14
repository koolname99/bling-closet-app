import hashlib

result = []

with open(r"C:\Users\snowb\OneDrive\Documents\Bling.closet\server_logs.txt", "r") as f:
    for line in f:
        stripped = line.rstrip('\n').rstrip('\r')
        
        # Ignore lines starting with SERVER or -
        if stripped.startswith("SERVER") or stripped.startswith("-"):
            continue
        
        # Calculate MD5 hash of the line including newline character
        line_with_newline = stripped + "\n"
        md5_hash = hashlib.md5(line_with_newline.encode()).hexdigest()
        
        # Check last character of hash
        last_char = md5_hash[-1]
        
        if last_char.isdigit():
            # KEEP - extract character at index 4
            if len(stripped) > 4:
                result.append(stripped[4])
            else:
                result.append('')  # line too short

print("Extracted characters:", result)
print("Hidden message:", ''.join(result))
