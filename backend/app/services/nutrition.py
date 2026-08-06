from app.services.bmi import calculate_bmi
from app.services.bmr import calculate_bmr
from app.services.tdee import calculate_tdee

SUPPORTED_GOALS = {
    "weight_loss",
    "maintenance",
    "weight_gain",
}

def calculate_target_calories(
        tdee: float,
        goal: str,
) -> float:
    if tdee <= 0:
        raise ValueError("TDEE  must greater than 0.")

    goal = goal.lower()

    if goal not in SUPPORTED_GOALS:
        raise ValueError(
            f"Goal must be one of {SUPPORTED_GOALS}."
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

    return {
        "bmi": bmi,
        "bmi_category": category,
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target,
    }
