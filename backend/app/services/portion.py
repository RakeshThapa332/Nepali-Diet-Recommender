def calculate_portion_grams(
    calories_per_100g: float,
    target_calories: float,
) -> float:
    """
    Calculate the portion of food required to provide
    the target number of calories.

    Nutritional values and calories are assumed to be
    calculated per 100 g of food.

    Formula:
        portion_grams = (target_calories / calories_per_100g) * 100
    """

    if calories_per_100g <= 0:
        raise ValueError(
            "Calories per 100 g must be greater than 0."
        )

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    portion = (
        target_calories
        / calories_per_100g
        * 100
    )

    return round(portion, 2)


def calculate_portion_calories(
    calories_per_100g: float,
    portion_grams: float,
) -> float:
    """
    Calculate the calories provided by a given
    portion of food.
    """

    if calories_per_100g <= 0:
        raise ValueError(
            "Calories per 100 g must be greater than 0."
        )

    if portion_grams <= 0:
        raise ValueError(
            "Portion must be greater than 0 g."
        )

    calories = (
        calories_per_100g
        * portion_grams
        / 100
    )

    return round(calories, 2)