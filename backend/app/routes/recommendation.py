from datetime import date, datetime, timedelta, timezone

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import UserProfile, MealPlan, MealPlanItem, FoodIntakeLog

from app.services.bmi import calculate_bmi
from app.services.bmr import calculate_bmr
from app.services.tdee import calculate_tdee
from app.services.meal_distribution import calculate_meal_calories
from app.services.daily_recommendation import (
    generate_daily_recommendation,
)
from app.services.nutrition import calculate_target_calories

from app.services.meal_plan_service import (
    get_today_meal_plan,
    save_meal_plan,
    meal_plan_to_dict,
    delete_today_meal_plan,
)


recommendation_bp = Blueprint(
    "recommendation",
    __name__,
    url_prefix="/api/recommendation",
)


def get_recent_food_ids(user_id: int, days: int = 7):
    """
    Return previously used food ids from the last N days so the
    recommender can avoid repeating the same foods too often.
    """

    recent_ids = set()
    cutoff_date = date.today() - timedelta(days=days)

    intake_ids = (
        FoodIntakeLog.query
        .filter_by(user_id=user_id)
        .filter(FoodIntakeLog.consumed_at >= datetime.now(timezone.utc) - timedelta(days=days))
        .with_entities(FoodIntakeLog.food_id)
        .all()
    )
    recent_ids.update(food_id for (food_id,) in intake_ids)

    plan_ids = (
        MealPlanItem.query
        .join(MealPlan)
        .filter(MealPlan.user_id == user_id)
        .filter(MealPlan.date >= cutoff_date)
        .with_entities(MealPlanItem.food_id)
        .all()
    )
    recent_ids.update(food_id for (food_id,) in plan_ids)

    return recent_ids


@recommendation_bp.route(
    "/daily",
    methods=["GET"],
)
@jwt_required()
def daily_recommendation():

    user_id = int(get_jwt_identity())

 
    existing_plan = get_today_meal_plan(
        user_id=user_id
    )

    if existing_plan:

        return jsonify({
            "success": True,
            "source": "database",
            "meal_plan_id": existing_plan.id,
            "recommendation": meal_plan_to_dict(
                existing_plan
            ),
        }), 200


    profile = UserProfile.query.filter_by(
        user_id=user_id
    ).first()

    if not profile:

        return jsonify({
            "success": False,
            "message": "User profile not found.",
        }), 404

    try:


        bmi, bmi_category = calculate_bmi(
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
        )


        bmr = calculate_bmr(
            age=profile.age,
            gender=profile.gender,
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
        )

        tdee = calculate_tdee(
            bmr=bmr,
            activity_level=profile.activity_level,
        )

        target_calories = calculate_target_calories(
            tdee=tdee,
            goal=profile.goal,
        )

        meal_calories = calculate_meal_calories(
            target_calories
        )

        recent_food_ids = get_recent_food_ids(user_id=user_id)

        recommendation = generate_daily_recommendation(
            meal_calories=meal_calories,
            target_calories=target_calories,
            body_type=profile.body_type,
            number_of_foods=3,
            recent_food_ids=recent_food_ids,
        )

        meal_plan = save_meal_plan(
            user_id=user_id,
            recommendation=recommendation,
        )
        
        return jsonify({
            "success": True,
            "source": "generated",
            "meal_plan_id": meal_plan.id,

            "nutrition": {
                "bmi": bmi,
                "bmi_category": bmi_category,
                "bmr": bmr,
                "tdee": tdee,
                "target_calories": target_calories,
            },

            "recommendation": recommendation,

        }), 200

    except ValueError as error:

        return jsonify({
            "success": False,
            "message": str(error),
        }), 400

    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Failed to generate recommendation.",
            "error": str(error),
        }), 500

@recommendation_bp.route(
    "/regenerate",
    methods=["POST"],
)
@jwt_required()
def regenerate_recommendation():

    user_id = int(get_jwt_identity())

    profile = UserProfile.query.filter_by(
        user_id=user_id
    ).first()

    if not profile:
        return jsonify({
            "success": False,
            "message": "User profile not found.",
        }), 404

    try:
        delete_today_meal_plan(
            user_id=user_id
        )

        bmi, bmi_category = calculate_bmi(
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
        )

        bmr = calculate_bmr(
            age=profile.age,
            gender=profile.gender,
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
        )

        tdee = calculate_tdee(
            bmr=bmr,
            activity_level=profile.activity_level,
        )

        target_calories = calculate_target_calories(
            tdee=tdee,
            goal=profile.goal,
        )

        meal_calories = calculate_meal_calories(
            target_calories
        )

        recent_food_ids = get_recent_food_ids(user_id=user_id)

        recommendation = generate_daily_recommendation(
            meal_calories=meal_calories,
            target_calories=target_calories,
            body_type=profile.body_type,
            number_of_foods=3,
            recent_food_ids=recent_food_ids,
        )

        meal_plan = save_meal_plan(
            user_id=user_id,
            recommendation=recommendation,
        )

        return jsonify({
            "success": True,
            "source": "generated",
            "nutrition": {
                "bmi": bmi,
                "bmi_category": bmi_category,
                "bmr": bmr,
                "tdee": tdee,
                "target_calories": target_calories,
            },
            "recommendation": meal_plan_to_dict(
                meal_plan
            ),
        }), 200

    except ValueError as error:

        return jsonify({
            "success": False,
            "message": str(error),
        }), 400

    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Failed to regenerate recommendation.",
            "error": str(error),
        }), 500