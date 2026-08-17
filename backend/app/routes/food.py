from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.models import Food

food_bp = Blueprint(
    "food",
    __name__,
    url_prefix="/api/food",
)


def food_to_dict(food):
    return {
        "id": food.id,
        "food_name": food.food_name,
        "calories": food.calories,
        "protein": food.protein,
        "fat": food.fat,
        "carbs": food.carbs,
        "fiber": food.fiber,
        "calcium": food.calcium,
        "iron": food.iron,
        "vitamin_c": food.vitamin_c,
        "breakfast": food.breakfast,
        "lunch": food.lunch,
        "dinner": food.dinner,
    }


# List / search / filter foods
@food_bp.route("/", methods=["GET"])
@jwt_required()
def list_foods():

    query = Food.query

    search = request.args.get("search")
    meal = request.args.get("meal")  # breakfast | lunch | dinner

    if search:
        query = query.filter(
            Food.food_name.ilike(f"%{search}%")
        )

    if meal in ("breakfast", "lunch", "dinner"):
        query = query.filter(
            getattr(Food, meal).is_(True)
        )

    foods = query.order_by(Food.food_name.asc()).all()

    return jsonify({
        "success": True,
        "foods": [food_to_dict(food) for food in foods],
    }), 200


# Single food details
@food_bp.route("/<int:food_id>", methods=["GET"])
@jwt_required()
def get_food(food_id):

    food = Food.query.get(food_id)

    if not food:
        return jsonify({
            "success": False,
            "message": "Food not found.",
        }), 404

    return jsonify({
        "success": True,
        "food": food_to_dict(food),
    }), 200
