from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

from app.extensions import db
from app.models import UserSettings


settings_bp = Blueprint(
    "settings",
    __name__,
    url_prefix="/api/settings"
)


def settings_to_dict(settings):
    return {
        "notifications_enabled": settings.notifications_enabled,

        "breakfast_enabled": settings.breakfast_enabled,
        "breakfast_time": settings.breakfast_time,

        "lunch_enabled": settings.lunch_enabled,
        "lunch_time": settings.lunch_time,

        "dinner_enabled": settings.dinner_enabled,
        "dinner_time": settings.dinner_time,

        "weekly_progress_enabled":
            settings.weekly_progress_enabled,

        "recommendation_enabled":
            settings.recommendation_enabled,
    }


# GET SETTINGS
@settings_bp.route("/", methods=["GET"])
@jwt_required()
def get_settings():

    user_id = int(get_jwt_identity())

    settings = UserSettings.query.filter_by(
        user_id=user_id
    ).first()

    # Create default settings if they don't exist
    if not settings:
        settings = UserSettings(
            user_id=user_id
        )

        try:
            db.session.add(settings)
            db.session.commit()

        except SQLAlchemyError:
            db.session.rollback()

            return jsonify({
                "success": False,
                "message": "Failed to create default settings."
            }), 500

    return jsonify({
        "success": True,
        "settings": settings_to_dict(settings)
    }), 200


# UPDATE SETTINGS
@settings_bp.route("/", methods=["PUT"])
@jwt_required()
def update_settings():

    user_id = int(get_jwt_identity())

    settings = UserSettings.query.filter_by(
        user_id=user_id
    ).first()

    if not settings:
        settings = UserSettings(
            user_id=user_id
        )

        db.session.add(settings)

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    boolean_fields = [
        "notifications_enabled",
        "breakfast_enabled",
        "lunch_enabled",
        "dinner_enabled",
        "weekly_progress_enabled",
        "recommendation_enabled",
    ]

    time_fields = [
        "breakfast_time",
        "lunch_time",
        "dinner_time",
    ]

    for field in boolean_fields:
        if field in data:
            setattr(
                settings,
                field,
                bool(data[field])
            )

    for field in time_fields:
        if field in data:
            setattr(
                settings,
                field,
                data[field]
            )

    try:
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Settings updated successfully.",
            "settings": settings_to_dict(settings)
        }), 200

    except SQLAlchemyError:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to update settings."
        }), 500