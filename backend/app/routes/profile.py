from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError 
from datetime import datetime

from app.extensions import db
from app.models import UserProfile
from app.services.nutrition import generate_nutrition_summary

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


def _parse_date_of_birth(value):
    """
    Parse an incoming date_of_birth value (YYYY-MM-DD string)
    into a date object. Returns None for empty/missing values.
    Raises ValueError for malformed dates.
    """
    if not value:
        return None

    return datetime.strptime(value, "%Y-%m-%d").date()

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
    body_type = data.get("body_type")
    goal = data.get("goal")
    dietary_preference = data.get("dietary_preference")

    if age is None or not gender or height_cm is None or weight_kg is None:
        return jsonify({
            "success": False,
            "message": "All required fields must be provided."
        }), 400

    try:
        date_of_birth = _parse_date_of_birth(
            data.get("date_of_birth")
        )
    except ValueError:
        return jsonify({
            "success": False,
            "message": "date_of_birth must be in YYYY-MM-DD format."
        }), 400


    profile = UserProfile(
        user_id = user_id,
        age = age,
        date_of_birth = date_of_birth,
        gender = gender,
        height_cm = height_cm,
        weight_kg = weight_kg,
        activity_level = activity_level,
        goal = goal,
        dietary_preference = dietary_preference,
        body_type=body_type,
    )

    try:
        db.session.add(profile)
        db.session.commit()

        nutrition = generate_nutrition_summary(
            age=profile.age,
            gender=profile.gender,
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
            activity_level=profile.activity_level,
            goal=profile.goal
        )

        return jsonify({
            "success": True,
            "message": "Profile created successfully.",
            "profile": {
                "age": profile.age,
                "date_of_birth": (
                    profile.date_of_birth.isoformat()
                    if profile.date_of_birth
                    else None
                ),
                "gender": profile.gender,
                "height_cm": profile.height_cm,
                "weight_kg": profile.weight_kg,
                "activity_level": profile.activity_level,
                "goal": profile.goal,
                "dietary_preference": profile.dietary_preference,
                "body_type": profile.body_type,
            },
            "nutrition": nutrition
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

        profile_data = {
            "id" : profile.id,
            "user_id": profile.user_id,
            "age": profile.age,
            "date_of_birth": (
                profile.date_of_birth.isoformat()
                if profile.date_of_birth
                else None
            ),
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "activity_level": profile.activity_level,
            "goal": profile.goal,
            "dietary_preference": profile.dietary_preference,
            "body_type": profile.body_type,
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

        try:
            nutrition = generate_nutrition_summary(
                age=profile.age,
                gender=profile.gender,
                weight_kg=profile.weight_kg,
                height_cm=profile.height_cm,
                activity_level=profile.activity_level,
                goal=profile.goal,
            )

            profile_data["bmi"] = nutrition["bmi"]
            profile_data["bmi_category"] = nutrition["bmi_category"]
            profile_data["bmr"] = nutrition["bmr"]
            profile_data["tdee"] = nutrition["tdee"]
            profile_data["target_calories"] = nutrition["target_calories"]

        except (ValueError, TypeError, AttributeError) as nutrition_error:
            print("PROFILE NUTRITION SKIPPED:", repr(nutrition_error))

        return jsonify({
            "success": True,
            "profile": profile_data,
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
    if "date_of_birth" in data:
        try:
            profile.date_of_birth = _parse_date_of_birth(
                data.get("date_of_birth")
            )
        except ValueError:
            return jsonify({
                "success": False,
                "message": "date_of_birth must be in YYYY-MM-DD format."
            }), 400

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
    profile.body_type = data.get(
    "body_type",
    profile.body_type
)

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

