from itertools import product

from app.services.food_calories import calculate_food_calories


def calculate_portion_score(
    foods,
    portions,
    target_calories: float,
    target_protein: float,
    target_fat: float,
    target_carbs: float,
) -> float:
    """
    Calculate how closely a set of food portions matches
    the nutritional targets.

    Lower score = better fit.

    Nutritional values are assumed to be per 100 g.
    """

    if not foods:
        raise ValueError(
            "At least one food is required."
        )

    if len(foods) != len(portions):
        raise ValueError(
            "Number of foods and portions must match."
        )

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    total_protein = 0.0
    total_fat = 0.0
    total_carbs = 0.0
    total_calories = 0.0
    total_portion = 0.0

    for food, portion in zip(foods, portions):

        if portion <= 0:
            return float("inf")

        multiplier = portion / 100

        protein = (food.protein or 0) * multiplier
        fat = (food.fat or 0) * multiplier
        carbs = (food.carbs or 0) * multiplier

        calories_per_100g = calculate_food_calories(
            protein=food.protein or 0,
            fat=food.fat or 0,
            carbs=food.carbs or 0,
        )

        calories = calories_per_100g * multiplier

        total_protein += protein
        total_fat += fat
        total_carbs += carbs
        total_calories += calories
        total_portion += portion

    calorie_error = (
        abs(total_calories - target_calories)
        / max(target_calories, 1)
    )

    protein_error = (
        abs(total_protein - target_protein)
        / max(target_protein, 1)
    )

    fat_error = (
        abs(total_fat - target_fat)
        / max(target_fat, 1)
    )

    carb_error = (
        abs(total_carbs - target_carbs)
        / max(target_carbs, 1)
    )

    # Penalize unnecessarily large total portions.
    #
    # This prevents the optimizer from selecting huge
    # portions simply because they happen to match macros.
    portion_penalty = (
        total_portion / (len(foods) * 100)
    ) * 0.02

    score = (
        0.50 * calorie_error
        + 0.20 * protein_error
        + 0.15 * fat_error
        + 0.15 * carb_error
        + portion_penalty
    )

    return round(score, 6)


def optimize_food_portions(
    foods,
    target_calories: float,
    target_protein: float,
    target_fat: float,
    target_carbs: float,
    min_portion: float = 25,
    max_portion: float = 300,
    step: float = 5,
):
    """
    Find realistic independent portion sizes for each food.

    Unlike the previous optimizer, each food can have a different
    portion size.

    Example:

        Food A -> 125 g
        Food B -> 25 g
        Food C -> 80 g

    instead of forcing:

        Food A -> 75 g
        Food B -> 75 g
        Food C -> 75 g

    The optimizer minimizes nutritional error while prioritizing
    calorie matching and avoiding unnecessarily large portions.
    """

    if not foods:
        raise ValueError(
            "At least one food is required."
        )

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    if target_protein < 0:
        raise ValueError(
            "Target protein cannot be negative."
        )

    if target_fat < 0:
        raise ValueError(
            "Target fat cannot be negative."
        )

    if target_carbs < 0:
        raise ValueError(
            "Target carbohydrates cannot be negative."
        )

    if min_portion <= 0:
        raise ValueError(
            "Minimum portion must be greater than 0."
        )

    if max_portion < min_portion:
        raise ValueError(
            "Maximum portion must be greater than minimum portion."
        )

    if step <= 0:
        raise ValueError(
            "Step must be greater than 0."
        )

    # We currently recommend exactly 3 foods per meal.
    if len(foods) != 3:
        raise ValueError(
            "Portion optimization currently requires exactly 3 foods."
        )

    # Generate practical portion sizes.
    portion_values = []

    portion = min_portion

    while portion <= max_portion:
        portion_values.append(round(portion, 2))
        portion += step

    best_portions = None
    best_score = float("inf")

    # Search independently for each of the three foods.
    #
    # With 25-300g and 5g steps:
    # 56 possible portions per food
    # 56^3 = 175,616 combinations.
    
    for portions in product(
        portion_values,
        repeat=len(foods),
    ):

        score = calculate_portion_score(
            foods=foods,
            portions=portions,
            target_calories=target_calories,
            target_protein=target_protein,
            target_fat=target_fat,
            target_carbs=target_carbs,
        )

        if score < best_score:
            best_score = score
            best_portions = list(portions)

    if best_portions is None:
        raise ValueError(
            "Unable to find suitable food portions."
        )

    return {
        "portions": best_portions,
        "score": round(best_score, 6),
    }