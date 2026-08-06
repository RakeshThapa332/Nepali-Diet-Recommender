from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models import User
from app.utils.security import hash_password, verify_password

import re

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

#Registration
EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Required Fields
    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required."
        }), 400

    # Name Validation
    if len(name) < 2:
        return jsonify({
            "success": False,
            "message": "Name must contain at least 2 characters."
        }), 400
    
    # Email Validation
    if not re.match(EMAIL_REGEX, email):
        return jsonify({
            "success": False,
            "message": "Invalid email format."
        }), 400

    # Password Validation
    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must be at least 8 characters long."
        }), 400

    if not re.search(r"[A-Z]", password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one uppercase letter."
        }), 400

    if not re.search(r"[a-z]", password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one lowercase letter."
        }), 400

    if not re.search(r"\d", password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one number."
        }), 400

    if not re.search(r"[!@#$%^&*()_\-+=\[\]{}|\\:;\"'<>,.?/`~]", password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one special character."
        }), 400

    # Existing User Check
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email is already registered."
        }), 409

    # Hash Password
    password_hash = hash_password(password)


    # Create User
    user = User(
        name=name,
        email=email,
        password_hash=password_hash
    )

    try:
        db.session.add(user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "User registered successfully.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            }
        }), 201

    except SQLAlchemyError:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Database error occurred while registering the user."
        }), 500

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500


#Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }
        ), 400

    email = data.get("email","").strip().lower()
    password = data.get("password","")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401
    
    if not verify_password(password, user.password_hash):
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "email": user.email,
            "name": user.name
        }
    )

    return jsonify({
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "Bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }),200