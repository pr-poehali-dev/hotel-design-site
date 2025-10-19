import hashlib

# Calculate SHA256 hash of "1401"
hash_object = hashlib.sha256("1401".encode())
hex_hash = hash_object.hexdigest()
print(hex_hash)
