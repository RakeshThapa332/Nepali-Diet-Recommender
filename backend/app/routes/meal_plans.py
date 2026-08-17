from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.meal_plan_service import (
    get_today_meal_plan,
    get_user_meal_plans,
    get_meal_plan_by_id,
    meal_plan_to_dict,
)


meal_plan_bp = Blueprint(
    "meal_plans",
    __name__,
    url_prefix="/api/meal-plans",
)


@meal_plan_bp.route(
    "/today",
    methods=["GET"],
)
@jwt_required()
def today_meal_plan():

    user_id = int(get_jwt_identity())

    meal_plan = get_today_meal_plan(
        user_id=user_id
    )

    if not meal_plan:
        return jsonify({
            "success": False,
            "message": "No meal plan found for today.",
        }), 404

    return jsonify({
        "success": True,
        "meal_plan": meal_plan_to_dict(
            meal_plan
        ),
    }), 200


@meal_plan_bp.route(
    "",
    methods=["GET"],
)
@jwt_required()
def all_meal_plans():

    user_id = int(get_jwt_identity())

    meal_plans = get_user_meal_plans(
        user_id=user_id
    )

    return jsonify({
        "success": True,
        "meal_plans": [
            meal_plan_to_dict(
                meal_plan
            )
            for meal_plan in meal_plans
        ],
    }), 200


@meal_plan_bp.route(
    "/<int:meal_plan_id>",
    methods=["GET"],
)
@jwt_required()
def single_meal_plan(meal_plan_id):

    user_id = int(get_jwt_identity())

    meal_plan = get_meal_plan_by_id(
        meal_plan_id=meal_plan_id,
        user_id=user_id,
    )

    if not meal_plan:
        return jsonify({
            "success": False,
            "message": "Meal plan not found.",
        }), 404

    return jsonify({
        "success": True,
        "meal_plan": meal_plan_to_dict(
            meal_plan
        ),
    }), 200