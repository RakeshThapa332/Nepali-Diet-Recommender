from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import RecommendationLog, FoodIntakeLog, Food

history_bp = Blueprint(
    "history",
    __name__,
    url_prefix="/api/history"
)


# Recommendation History
@history_bp.route("/recommendations", methods=["GET"])
@jwt_required()
def get_recommendation_history():

    user_id = int(get_jwt_identity())

    logs = (
        RecommendationLog.query
        .filter_by(user_id=user_id)
        .order_by(RecommendationLog.generated_at.desc())
        .all()
    )

    return jsonify({
        "success": True,
        "recommendations": [
            {
                "id": log.id,
                "target_calories": log.target_calories,
                "goal": log.goal,
                "cluster_id": log.cluster_id,
                "generated_at": (
                    log.generated_at.isoformat()
                    if log.generated_at
                    else None
                ),
            }
            for log in logs
        ]
    }), 200



# Food Intake History
@history_bp.route("/intake", methods=["GET"])
@jwt_required()
def get_food_intake_history():

    user_id = int(get_jwt_identity())

    logs = (
        FoodIntakeLog.query
        .filter_by(user_id=user_id)
        .order_by(FoodIntakeLog.consumed_at.desc())
        .all()
    )

    return jsonify({
        "success": True,
        "intake_logs": [
            {
                "id": log.id,
                "food_id": log.food_id,
                "food_name": log.food.food_name if log.food else None,
                "quantity_g": log.quantity_g,
                "meal_type": log.meal_type,
                "consumed_at": (
                    log.consumed_at.isoformat()
                    if log.consumed_at
                    else None
                ),
            }
            for log in logs
        ]
    }), 200

#record food eaten
@history_bp.route("/intake", methods=["POST"])
@jwt_required()
def add_food_intake():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    food_id = data.get("food_id")
    quantity_g = data.get("quantity_g")
    meal_type = data.get("meal_type")

    if not food_id or not quantity_g or not meal_type:
        return jsonify({
            "success": False,
            "message": "food_id, quantity_g and meal_type are required."
        }), 400

    food = db.session.get(Food, food_id)

    if not food:
        return jsonify({
            "success": False,
            "message": "Food not found."
        }), 404

    if quantity_g <= 0:
        return jsonify({
            "success": False,
            "message": "Quantity must be greater than zero."
        }), 400

    intake = FoodIntakeLog(
        user_id=user_id,
        food_id=food_id,
        quantity_g=quantity_g,
        meal_type=meal_type
    )

    try:
        db.session.add(intake)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Food intake recorded successfully.",
            "intake": {
                "id": intake.id,
                "food_id": intake.food_id,
                "food_name": food.name,
                "quantity_g": intake.quantity_g,
                "meal_type": intake.meal_type,
                "consumed_at": intake.consumed_at.isoformat()
            }
        }), 201

    except SQLAlchemyError:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Database error."
        }), 500