from typing import Tuple

def calculate_bmi(weight_kg: float, height_cm: float) -> Tuple[float, str]:
    """
    Calculate BMI and return the BMI value along with its category.

    Args:
        weight_kg(float): Weight in kilograms.
        height_cm(float): Height in centimeters.

    Returns:
        Tuple[float,str]: (BMI, BMI category)
    """
    
    if weight_kg <= 0:
        raise ValueError("Weight must be greater than 0 kg.")

    if height_cm <=0:
        raise ValueError("Height must be greater than 0 cm.")

    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    bmi = round(bmi, 2)

    if bmi < 18.5:
        category= "Underweight"

    elif bmi< 25:
        category = "Normal"

    elif bmi < 30:
        category= "Overweight"

    else:
        category = "Obese"

    return bmi, category
