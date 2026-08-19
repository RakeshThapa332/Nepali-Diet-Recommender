from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import RecommendationLog, FoodIntakeLog, Food, MealPlan, UserProfile

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
    page = max(request.args.get("page", 1, type=int), 1)
    per_page = min(max(request.args.get("per_page", 20, type=int), 1), 100)

    pagination = (
        MealPlan.query
        .filter_by(user_id=user_id)
        .order_by(MealPlan.date.desc(), MealPlan.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    meal_plans = pagination.items

    profile = UserProfile.query.filter_by(user_id=user_id).first()

    recommendations = []

    for plan in meal_plans:
        foods = []

        for item in plan.items:
            if not item.food:
                continue

            foods.append({
                "food_id": item.food_id,
                "food_name": item.food.food_name,
                "meal_type": item.meal_type,
                "portion_grams": round(float(item.serving_size or 0), 2),
                "calories": round(float(item.calories or 0), 2),
                "protein": round(float(item.protein or 0), 2),
                "carbs": round(float(item.carbs or 0), 2),
                "fat": round(float(item.fat or 0), 2),
            })

        recommendations.append({
            "id": plan.id,
            "meal_plan_id": plan.id,
            "target_calories": round(float(plan.target_calories or 0), 2),
            "goal": profile.goal if profile else "",
            "cluster_id": None,
            "generated_at": (
                plan.created_at.isoformat()
                if plan.created_at
                else plan.date.isoformat()
            ),
            "foods": foods,
        })

    return jsonify({
        "success": True,
        "recommendations": recommendations,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        },
    }), 200



# Food Intake History
@history_bp.route("/intake", methods=["GET"])
@jwt_required()
def get_food_intake_history():

    user_id = int(get_jwt_identity())
    page = max(request.args.get("page", 1, type=int), 1)
    per_page = min(max(request.args.get("per_page", 20, type=int), 1), 100)

    pagination = (
        FoodIntakeLog.query
        .filter_by(user_id=user_id)
        .order_by(FoodIntakeLog.consumed_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    logs = pagination.items

    intake_logs = []

    for log in logs:
        food = log.food

        if food:
            quantity_g = float(log.quantity_g or 0)
            factor = quantity_g / 100 if quantity_g > 0 else 0

            calories = (food.calories or 0) * factor
            protein = (food.protein or 0) * factor
            carbs = (food.carbs or 0) * factor
            fat = (food.fat or 0) * factor
        else:
            calories = 0
            protein = 0
            carbs = 0
            fat = 0

        intake_logs.append({
            "id": log.id,
            "food_id": log.food_id,
            "food_name": food.food_name if food else None,
            "quantity_g": log.quantity_g,
            "meal_type": log.meal_type,
            "calories": round(calories, 2),
            "protein": round(protein, 2),
            "carbs": round(carbs, 2),
            "fat": round(fat, 2),
            "consumed_at": (
                log.consumed_at.isoformat()
                if log.consumed_at
                else None
            ),
        })

    return jsonify({
        "success": True,
        "intake_logs": intake_logs,
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        },
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
                "food_name": food.food_name,
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