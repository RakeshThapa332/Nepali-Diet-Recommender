#Mifflin St. Jeor Equation

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "lightly_active": 1.375,
    "moderately_active": 1.55,
    "very_active": 1.725,
    "extra_active": 1.9,
}

def calculate_tdee(
        bmr:float,
        activity_level: str,
        ) -> float:
    if bmr <= 0:
        raise ValueError("BMR must be greater than 0.")

    activity_level = activity_level.lower()

    if activity_level not in ACTIVITY_MULTIPLIERS:
        raise ValueError(
            f"Unsupported activity level. Choose from: "
            f"{list(ACTIVITY_MULTIPLIERS.keys())}"
        )
    tdee = bmr * ACTIVITY_MULTIPLIERS[activity_level]

    return round(tdee, 2)
