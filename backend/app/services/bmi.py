from typing import Tuple

def calculate_bmi(weight_kg: float, height_cm: float) -> Tuple[float, str]:
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
