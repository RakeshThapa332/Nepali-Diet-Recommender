def calculate_food_calories(
    protein: float,
    fat: float,
    carbs: float,
) -> float:
    """
    Calculate food energy using the Atwater factors.

    Protein = 4 kcal/g
    Carbohydrate = 4 kcal/g
    Fat = 9 kcal/g

    Input nutritional values are assumed to be
    per 100 g of food.
    """

    if protein < 0:
        raise ValueError("Protein cannot be negative.")

    if fat < 0:
        raise ValueError("Fat cannot be negative.")

    if carbs < 0:
        raise ValueError("Carbohydrates cannot be negative.")

    calories = (
        (4 * protein)
        + (9 * fat)
        + (4 * carbs)
    )

    return round(calories, 2)


def calculate_portion_calories(
    protein: float,
    fat: float,
    carbs: float,
    portion_grams: float,
) -> float:
    """
    Calculate calories for a given portion.

    Nutritional values are per 100 g.
    """

    if portion_grams <= 0:
        raise ValueError(
            "Portion must be greater than 0 g."
        )

    calories_per_100g = calculate_food_calories(
        protein,
        fat,
        carbs,
    )

    calories = (
        calories_per_100g
        * portion_grams
        / 100
    )

    return round(calories, 2)