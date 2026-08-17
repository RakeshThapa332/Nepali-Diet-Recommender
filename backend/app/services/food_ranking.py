from itertools import combinations


def calculate_food_fit_score(
    food,
    target_calories: float,
    target_protein: float,
    target_fat: float,
    target_carbs: float,
) -> float:
    """
    Calculate how closely a food matches the nutritional
    target for a meal.

    Lower score = better nutritional fit.

    Nutritional values are assumed to be per 100 g.
    """

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    protein = food.protein or 0
    fat = food.fat or 0
    carbs = food.carbs or 0

    calories = (
        (4 * protein)
        + (9 * fat)
        + (4 * carbs)
    )

    if calories <= 0:
        return float("inf")

    calorie_difference = abs(
        calories - target_calories
    ) / target_calories

    protein_difference = abs(
        protein - target_protein
    ) / max(target_protein, 1)

    fat_difference = abs(
        fat - target_fat
    ) / max(target_fat, 1)

    carb_difference = abs(
        carbs - target_carbs
    ) / max(target_carbs, 1)

    score = (
        0.25 * calorie_difference
        + 0.25 * protein_difference
        + 0.25 * fat_difference
        + 0.25 * carb_difference
    )

    return round(score, 6)


def rank_foods(
    foods,
    target_calories: float,
    target_protein: float,
    target_fat: float,
    target_carbs: float,
):
    """
    Rank individual foods from best to worst nutritional fit.
    """

    ranked = []

    for food in foods:

        if (
            food.protein is None
            or food.fat is None
            or food.carbs is None
        ):
            continue

        score = calculate_food_fit_score(
            food=food,
            target_calories=target_calories,
            target_protein=target_protein,
            target_fat=target_fat,
            target_carbs=target_carbs,
        )

        if score == float("inf"):
            continue

        ranked.append({
            "food": food,
            "score": score,
        })

    ranked.sort(
        key=lambda item: item["score"]
    )

    return ranked


def calculate_combination_score(
    foods,
    target_calories: float,
    target_protein: float,
    target_fat: float,
    target_carbs: float,
) -> float:
    """
    Calculate how well a combination of foods matches
    the nutritional requirements.

    Lower score = better fit.

    Nutritional values are per 100 g.
    """

    if len(foods) != 3:
        raise ValueError(
            "Exactly 3 foods are required."
        )

    total_protein = sum(
        food.protein or 0
        for food in foods
    )

    total_fat = sum(
        food.fat or 0
        for food in foods
    )

    total_carbs = sum(
        food.carbs or 0
        for food in foods
    )

    total_calories = (
        (4 * total_protein)
        + (9 * total_fat)
        + (4 * total_carbs)
    )

    calorie_error = abs(
        total_calories - target_calories
    ) / target_calories

    protein_error = abs(
        total_protein - target_protein
    ) / max(target_protein, 1)

    fat_error = abs(
        total_fat - target_fat
    ) / max(target_fat, 1)

    carb_error = abs(
        total_carbs - target_carbs
    ) / max(target_carbs, 1)

    score = (
        0.25 * calorie_error
        + 0.25 * protein_error
        + 0.25 * fat_error
        + 0.25 * carb_error
    )

    return round(score, 6)


def find_best_food_combination(
    foods,
    target_calories: float,
    target_protein: float,
    target_fat: float,
    target_carbs: float,
    number_of_foods: int = 3,
):
    """
    Find the best combination of foods from the K-Means
    candidate cluster.
    """

    if number_of_foods <= 0:
        raise ValueError(
            "Number of foods must be greater than 0."
        )

    valid_foods = [
        food
        for food in foods
        if (
            food.protein is not None
            and food.fat is not None
            and food.carbs is not None
        )
    ]

    if len(valid_foods) < number_of_foods:
        raise ValueError(
            "Not enough valid foods available."
        )

    best_combination = None
    best_score = float("inf")

    for combination in combinations(
        valid_foods,
        number_of_foods,
    ):

        score = calculate_combination_score(
            foods=combination,
            target_calories=target_calories,
            target_protein=target_protein,
            target_fat=target_fat,
            target_carbs=target_carbs,
        )

        if score < best_score:
            best_score = score
            best_combination = combination

    return {
        "foods": list(best_combination),
        "score": best_score,
    }