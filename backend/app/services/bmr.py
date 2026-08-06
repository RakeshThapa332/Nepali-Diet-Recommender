#Mifflin-St Jeor Equation
SUPPORTED_GENDERS = {"male", "female"}

def calculate_bmr(
        age: int,
        gender: str,
        weight_kg: float,
        height_cm: float,
) -> float:
     
    """
    Calculate Basal Metabolic Rate (BMR)
    using the Mifflin–St Jeor equation.

    Args:
        age: Age in years.
        gender: "male" or "female".
        weight_kg: Weight in kilograms.
        height_cm: Height in centimeters.

    Returns:
        BMR in kcal/day.
    """
    if age <= 0:
        raise ValueError("Age must be greater than 0.")

    if weight_kg <=0:
        raise ValueError("Weight must be greater than 0.")

    if height_cm <=0:
        raise ValueError("Height must be greater than 0.")

    gender= gender.strip().lower()

    if gender not in SUPPORTED_GENDERS:
        raise ValueError(
            f"Gender must be one of {SUPPORTED_GENDERS}."
        )

    if gender == "male":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) -161

    return round(bmr, 2)
    
