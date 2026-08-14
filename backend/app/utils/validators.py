
from app.config.constants import ACTIVITY_MULTIPLIERS, GOAL_CALORIE_ADJUSTMENT, GENDER_MALE, GENDER_FEMALE


def validate_profile_input(data: dict) -> None:
    required_fields = ["age", "gender", "height_cm", "weight_kg", "activity_level", "goal"]
    missing = [f for f in required_fields if f not in data or data[f] in (None, "")]
    if missing:
        raise ValueError(f"Missing required fields: {missing}")

    if not isinstance(data["age"], (int, float)) or not (1 <= data["age"] <= 120):
        raise ValueError("age must be a number between 1 and 120")

    gender = str(data["gender"]).lower()
    if gender not in (GENDER_MALE, GENDER_FEMALE):
        raise ValueError(f"gender must be one of: {GENDER_MALE}, {GENDER_FEMALE}")

    if not isinstance(data["height_cm"], (int, float)) or data["height_cm"] <= 0:
        raise ValueError("height_cm must be a positive number")

    if not isinstance(data["weight_kg"], (int, float)) or data["weight_kg"] <= 0:
        raise ValueError("weight_kg must be a positive number")

    activity_level = str(data["activity_level"]).lower()
    if activity_level not in ACTIVITY_MULTIPLIERS:
        raise ValueError(f"activity_level must be one of: {list(ACTIVITY_MULTIPLIERS.keys())}")

    goal = str(data["goal"]).lower()
    if goal not in GOAL_CALORIE_ADJUSTMENT:
        raise ValueError(f"goal must be one of: {list(GOAL_CALORIE_ADJUSTMENT.keys())}")
