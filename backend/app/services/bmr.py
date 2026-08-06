SUPPORTED_GENDERS = {"male", "female"}

def calculate_bmr(
        age: int,
        gender: str,
        weight: float,
        height: float,
) -> float:
    if age <= 0:
        raise ValueError("Age must be greater than 0.")

    if weight <=0:
        raise ValueError("Weight must be greater than 0.")

    if height <=0:
        raise ValueError("Height must be greater than 0.")

    gender= gender.lower()

    if gender not in SUPPORTED_GENDERS:
        raise ValueError(
            f"Gender must be one of {SUPPORTED_GENDERS}."
        )

    if gender == "male":
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) -161

    return round(bmr, 2)
    
