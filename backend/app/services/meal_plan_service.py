from datetime import date

from app.extensions import db
from app.models import MealPlan, MealPlanItem


def save_meal_plan(
    user_id: int,
    recommendation: dict,
):
    """
    Save a generated daily recommendation
    into meal_plans and meal_plan_items.

    If today's plan already exists, return it
    instead of creating a duplicate.
    """

    existing_plan = MealPlan.query.filter_by(
        user_id=user_id,
        date=date.today(),
    ).first()

    if existing_plan:
        return existing_plan

    meal_plan = MealPlan(
        user_id=user_id,
        date=date.today(),
        target_calories=recommendation[
            "target_calories"
        ],
        macro_split={
            "daily_macros": recommendation[
                "daily_macros"
            ],
            "meal_macros": recommendation[
                "meal_macros"
            ],
            "meal_calories": recommendation[
                "meal_calories"
            ],
        },
    )

    db.session.add(meal_plan)

    # Get meal_plan.id before creating items
    db.session.flush()

    for meal_type, meal in recommendation[
        "meals"
    ].items():

        for food in meal["foods"]:

            item = MealPlanItem(
                meal_plan_id=meal_plan.id,
                food_id=food["food_id"],
                meal_type=meal_type,
                serving_size=food[
                    "portion_grams"
                ],

                calories=food["calories"],
                protein=food["protein"],
                fat=food["fat"],
                carbs=food["carbs"],
            )

            db.session.add(item)

    try:
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    return meal_plan


def get_today_meal_plan(user_id: int):
    """
    Retrieve today's saved meal plan for a user.
    """

    return MealPlan.query.filter_by(
        user_id=user_id,
        date=date.today(),
    ).first()

def get_user_meal_plans(user_id: int):
    """
    Retrieve all saved meal plans belonging
    to the authenticated user.
    """

    return (
        MealPlan.query
        .filter_by(user_id=user_id)
        .order_by(MealPlan.date.desc())
        .all()
    )


def get_meal_plan_by_id(
    meal_plan_id: int,
    user_id: int,
):
    """
    Retrieve one meal plan belonging to the
    authenticated user.

    The user_id check prevents one user from
    accessing another user's meal plan.
    """

    return MealPlan.query.filter_by(
        id=meal_plan_id,
        user_id=user_id,
    ).first()

def meal_plan_to_dict(meal_plan):
    """
    Convert a saved MealPlan into a JSON-compatible
    recommendation structure.

    Nutrition values are read from the snapshot stored
    in MealPlanItem so historical meal plans remain
    consistent even if the Food table changes later.
    """

    if not meal_plan:
        return None

    meals = {
        "breakfast": {
            "foods": [],
            "total_calories": 0,
            "total_macros": {
                "protein": 0,
                "fat": 0,
                "carbs": 0,
            },
        },
        "lunch": {
            "foods": [],
            "total_calories": 0,
            "total_macros": {
                "protein": 0,
                "fat": 0,
                "carbs": 0,
            },
        },
        "dinner": {
            "foods": [],
            "total_calories": 0,
            "total_macros": {
                "protein": 0,
                "fat": 0,
                "carbs": 0,
            },
        },
    }


    for item in meal_plan.items:

        food = item.food

        if not food:
            continue

        meal = meals.get(item.meal_type)

        if meal is None:
            continue

        portion = item.serving_size or 0

        if portion <= 0:
            continue


        calories = item.calories or 0
        protein = item.protein or 0
        fat = item.fat or 0
        carbs = item.carbs or 0

        # Calculate the equivalent per-100g calories
        # only for display purposes.
        calories_per_100g = (
            calories * 100 / portion
        )


        meal["foods"].append({
            "food_id": food.id,

            "food_name": food.food_name,

            "portion_grams": round(
                portion,
                2,
            ),

            "calories": round(
                calories,
                2,
            ),

            "calories_per_100g": round(
                calories_per_100g,
                2,
            ),

            "protein": round(
                protein,
                2,
            ),

            "fat": round(
                fat,
                2,
            ),

            "carbs": round(
                carbs,
                2,
            ),
        })


        meal["total_calories"] += calories

        meal["total_macros"]["protein"] += protein
        meal["total_macros"]["fat"] += fat
        meal["total_macros"]["carbs"] += carbs


    for meal in meals.values():

        meal["total_calories"] = round(
            meal["total_calories"],
            2,
        )

        meal["total_macros"]["protein"] = round(
            meal["total_macros"]["protein"],
            2,
        )

        meal["total_macros"]["fat"] = round(
            meal["total_macros"]["fat"],
            2,
        )

        meal["total_macros"]["carbs"] = round(
            meal["total_macros"]["carbs"],
            2,
        )

    macro_split = meal_plan.macro_split or {}

    return {
        "meal_plan_id": meal_plan.id,

        "date": meal_plan.date.isoformat(),

        "target_calories": round(
            meal_plan.target_calories,
            2,
        ),

        "daily_macros": macro_split.get(
            "daily_macros",
            {},
        ),

        "meal_calories": macro_split.get(
            "meal_calories",
            {},
        ),

        "meal_macros": macro_split.get(
            "meal_macros",
            {},
        ),

        "meals": meals,
    }


def delete_today_meal_plan(user_id: int):
    """
    Delete today's meal plan for a user.

    Returns True if a plan was deleted,
    otherwise False.
    """

    meal_plan = MealPlan.query.filter_by(
        user_id=user_id,
        date=date.today(),
    ).first()

    if not meal_plan:
        return False

    try:
        db.session.delete(meal_plan)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise

    return True