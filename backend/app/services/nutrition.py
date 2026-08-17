from app.services.bmi import calculate_bmi
from app.services.bmr import calculate_bmr
from app.services.tdee import calculate_tdee
from app.services.meal_distribution import calculate_meal_calories

SUPPORTED_GOALS = {
    "weight_loss",
    "maintenance",
    "weight_gain",
}

GOAL_MAPPING = {
    "weight loss": "weight_loss",
    "weight_loss": "weight_loss",

    "maintain weight": "maintenance",
    "maintenance": "maintenance",

    "weight gain": "weight_gain",
    "weight_gain": "weight_gain",
}


def calculate_target_calories(
        tdee: float,
        goal: str,
) -> float:
    if tdee <= 0:
        raise ValueError("TDEE  must greater than 0.")

    goal = goal.strip().lower()
    goal = GOAL_MAPPING.get(goal)

    if goal not in SUPPORTED_GOALS:
        raise ValueError(
            f"Goal must be one of:"
            f"{list(GOAL_MAPPING.keys())}"
        )

    if goal == "weight_loss":
        calories = tdee - 500

    elif goal == "weight_gain":
        calories = tdee + 500

    else:
        calories = tdee

    return round(calories, 2)


def generate_nutrition_summary(
        age: int,
        gender: str,
        weight_kg: float,
        height_cm: float,
        activity_level: str,
        goal: str,
)-> dict:
    
    bmi, category = calculate_bmi(weight_kg, height_cm)

    bmr = calculate_bmr(
        age = age,
        gender = gender,
        weight_kg = weight_kg,
        height_cm = height_cm,
    )

    tdee = calculate_tdee(
        bmr = bmr,
        activity_level = activity_level,
    )

    target = calculate_target_calories(
        tdee = tdee,
        goal =  goal,
    )

    meal_calories = calculate_meal_calories(
        target
    )

    return {
        "bmi": bmi,
        "bmi_category": category,
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target,
        "meal_calories" : meal_calories,
    }
