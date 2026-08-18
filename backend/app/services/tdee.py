#Mifflin St. Jeor Equation

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

def calculate_tdee(
        bmr:float,
        activity_level: str,
        ) -> float:
    if bmr <= 0:
        raise ValueError("BMR must be greater than 0.")

    activity_level = activity_level.strip().lower().replace(" ", "_")

    if activity_level not in ACTIVITY_MULTIPLIERS:
        raise ValueError(
            f"Unsupported activity level. Choose from: "
            f"{list(ACTIVITY_MULTIPLIERS.keys())}"
        )
    tdee = bmr * ACTIVITY_MULTIPLIERS[activity_level]

    return round(tdee, 2)