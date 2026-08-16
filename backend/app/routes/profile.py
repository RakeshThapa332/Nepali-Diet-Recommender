from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError 

from app.extensions import db
from app.models import UserProfile

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

#Create profile 
@profile_bp.route("/", methods=["POST"])
@jwt_required()
def create_profile():
    user_id = int(get_jwt_identity())

    existing_profile = UserProfile.query.filter_by(user_id=user_id).first()
    if existing_profile:
        return jsonify({
            "success": False,
            "message": "Profile already exists."
        }), 409

    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    age = data.get("age")
    gender = data.get("gender")
    height_cm = data.get("height_cm")
    weight_kg = data.get("weight_kg")
    activity_level = data.get("activity_level")
    goal = data.get("goal")
    dietary_preference = data.get("dietary_preference")

    if age is None or not gender or height_cm is None or weight_kg is None:
        return jsonify({
            "success": False,
            "message": "All required fields must be provided."
        }), 400

    profile = UserProfile(
        user_id = user_id,
        age = age,
        gender = gender,
        height_cm = height_cm,
        weight_kg = weight_kg,
        activity_level = activity_level,
        goal = goal,
        dietary_preference = dietary_preference
    )

    try:
        db.session.add(profile)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Profile created successfully.",
            "profile": {
                "age": profile.age,
                "gender": profile.gender,
                "height_cm": profile.height_cm,
                "weight_kg": profile.weight_kg,
                "activity_level": profile.activity_level,
                "goal": profile.goal,
                "dietary_preference": profile.dietary_preference,
            }
        }), 201

    except SQLAlchemyError:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Database error."
        }), 500


#Get Profile
@profile_bp.route("/", methods=["GET"])
@jwt_required()

def get_profile():
    try:
        user_id = int(get_jwt_identity())
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({
                "success": False,
                "message": "Profile not found."
            }), 404

        return jsonify({
            "success": True,
            "profile": {
                "id" : profile.id,
                "user_id": profile.user_id,
                "age": profile.age,
                "gender": profile.gender,
                "height_cm": profile.height_cm,
                "weight_kg": profile.weight_kg,
                "activity_level": profile.activity_level,
                "goal": profile.goal,
                "dietary_preference": profile.dietary_preference,
                "created_at": (
                    profile.created_at.isoformat()
                    if profile.created_at
                    else None
                ),
                "updated_at" : (
                    profile.updated_at.isoformat()
                    if profile.updated_at
                    else None
                ),

        }
    }), 200
    except Exception as e:
        print("GET PROFILE ERROR:", repr(e))
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": "Failed to load profile."
        }), 500

#Update Profile
@profile_bp.route("/", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = int(get_jwt_identity())
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({
            "success": False,
            "message": "Profile not found."
        }), 404

    data = request.get_json()

    profile.age = data.get("age", profile.age)
    profile.gender = data.get("gender", profile.gender)
    profile.height_cm = data.get("height_cm", profile.height_cm)
    profile.weight_kg = data.get("weight_kg", profile.weight_kg)
    profile.activity_level = data.get(
        "activity_level",
        profile.activity_level
    )
    profile.goal = data.get("goal", profile.goal)
    profile.dietary_preference = data.get("dietary_preference", profile.dietary_preference)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Profile updated successfully."
    }), 200

#Delete Profile
@profile_bp.route("/", methods=["DELETE"])
@jwt_required()
def delete_profile():

    user_id = int(get_jwt_identity())
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({
            "success": False,
            "message": "Profile not found."
        }), 404

    db.session.delete(profile)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Profile deleted successfully."
    }), 200

