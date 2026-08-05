""""
from app.utils.security import hash_password, verify_password

password = "MySecurePassword123"

hashed = hash_password(password)

print("Original:", password)
print("Hashed:", hashed)

print("Correct Password:", verify_password(password, hashed))
print("Wrong Password:", verify_password("wrongpassword", hashed))\
"""
from app.utils.security import hash_password, verify_password

password = "MySecurePassword123"

hashed = hash_password(password)

print("Original:", password)
print("Hashed:", hashed)
print("Correct Password:", verify_password(password, hashed))
print("Wrong Password:", verify_password("WrongPassword123", hashed))