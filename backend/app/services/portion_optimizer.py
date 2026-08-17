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

    Nutritional values are per 100 g.

    Lower score = better fit.
    """

    total_protein = 0
    total_fat = 0
    total_carbs = 0
    total_calories = 0

    for food, portion in zip(foods, portions):

        multiplier = portion / 100

        protein = (food.protein or 0) * multiplier
        fat = (food.fat or 0) * multiplier
        carbs = (food.carbs or 0) * multiplier

        calories = calculate_food_calories(
            protein=food.protein or 0,
            fat=food.fat or 0,
            carbs=food.carbs or 0,
        )

        calories *= multiplier

        total_protein += protein
        total_fat += fat
        total_carbs += carbs
        total_calories += calories

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

    score = (
        0.40 * calorie_error
        + 0.20 * protein_error
        + 0.20 * fat_error
        + 0.20 * carb_error
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
    Find the best portion size for each selected food.

    The optimizer searches through practical portion sizes
    and selects the combination that minimizes nutritional error.

    Default:
        Minimum portion = 25 g
        Maximum portion = 300 g
        Step = 5 g
    """

    if not foods:
        raise ValueError(
            "At least one food is required."
        )

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
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

    best_portions = None
    best_score = float("inf")

    portion = min_portion

    while portion <= max_portion:

        # For now, optimize all selected foods equally.
        portions = [
            portion
            for _ in foods
        ]

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
            best_portions = portions

        portion += step

    return {
        "portions": best_portions,
        "score": best_score,
    }