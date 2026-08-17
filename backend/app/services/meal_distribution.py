MEAL_DISTRIBUTION = {
    "breakfast": 0.25,
    "lunch": 0.40,
    "dinner": 0.35,
}


def calculate_meal_calories(
    target_calories: float,
) -> dict:
    """
    Divide daily target calories among
    breakfast, lunch and dinner.
    """

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    return {
        meal: round(
            target_calories * percentage,
            2
        )
        for meal, percentage in MEAL_DISTRIBUTION.items()
    }


def calculate_meal_macros(
    protein: float,
    fat: float,
    carbs: float,
) -> dict:
    """
    Distribute daily macro targets across
    breakfast, lunch and dinner using the
    same meal distribution percentages.
    """

    if protein < 0:
        raise ValueError(
            "Protein cannot be negative."
        )

    if fat < 0:
        raise ValueError(
            "Fat cannot be negative."
        )

    if carbs < 0:
        raise ValueError(
            "Carbohydrates cannot be negative."
        )

    return {
        meal: {
            "protein": round(
                protein * percentage,
                2
            ),
            "fat": round(
                fat * percentage,
                2
            ),
            "carbs": round(
                carbs * percentage,
                2
            ),
        }
        for meal, percentage in MEAL_DISTRIBUTION.items()
    }