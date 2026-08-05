from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password: str) ->  str:
    """
    Hash a plain-text passwod.

    Args:
        password(str): User's plain-text password.

    Returns:
        str: Secure hashed password.
    """
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify a plain-text password against its hashed value.

    Args:
        password(str): Plain-text password.
        password_hash(str): Stored hashed password.
    
    Returns:
        bool: True if password matches, otherwise False.
    """
    return check_password_hash(password_hash, password)