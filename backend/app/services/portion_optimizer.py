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
    max_portion: float = 250,
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

    # A full grid search here would mean trying every portion
    # for every food against every portion of every other food
    # (56 x 56 x 56 = 175,616 combinations per meal). That is
    # what was making meal-plan generation slow.
    #
    # Instead we use coordinate descent: start from a sensible
    # initial guess (calories split evenly across the foods),
    # then repeatedly optimize one food's portion at a time
    # while holding the others fixed. This checks a few hundred
    # combinations instead of hundreds of thousands, while still
    # converging to essentially the same result because the
    # portion score is well-behaved (changing one food's portion
    # doesn't flip the best choice for the others).

    def calories_per_100g(food):
        return calculate_food_calories(
            protein=food.protein or 0,
            fat=food.fat or 0,
            carbs=food.carbs or 0,
        )

    def closest_portion_value(grams):
        return min(
            portion_values,
            key=lambda value: abs(value - grams),
        )

    def score_for(portions):
        return calculate_portion_score(
            foods=foods,
            portions=portions,
            target_calories=target_calories,
            target_protein=target_protein,
            target_fat=target_fat,
            target_carbs=target_carbs,
        )

    def coordinate_descent(initial_portions, passes=3):
        current = list(initial_portions)
        current_score = score_for(current)

        for _ in range(passes):
            improved = False

            for index in range(len(foods)):
                local_best_value = current[index]
                local_best_score = current_score

                for value in portion_values:
                    trial_portions = list(current)
                    trial_portions[index] = value

                    score = score_for(trial_portions)

                    if score < local_best_score:
                        local_best_score = score
                        local_best_value = value

                if local_best_value != current[index]:
                    current[index] = local_best_value
                    current_score = local_best_score
                    improved = True

            if not improved:
                break

        return current, current_score

    # Coordinate descent can settle into different local optima
    # depending on where it starts, so we try it from a couple
    # of different, cheap-to-compute starting points and keep
    # whichever converges to the best score. This is still a
    # tiny fraction of the cost of a full grid search.
    even_share = target_calories / len(foods)
    midpoint = closest_portion_value(
        (min_portion + max_portion) / 2
    )

    starting_points = []

    # 1. Proportional to each food's calorie density.
    proportional_start = []

    for food in foods:
        density = calories_per_100g(food)

        if density <= 0:
            grams = min_portion
        else:
            grams = (even_share / density) * 100
            grams = min(max(grams, min_portion), max_portion)

        proportional_start.append(closest_portion_value(grams))

    starting_points.append(proportional_start)

    # 2. Every food at the midpoint of the allowed range.
    starting_points.append([midpoint] * len(foods))

    # 3. Every food at the minimum portion.
    starting_points.append(
        [closest_portion_value(min_portion)] * len(foods)
    )

    best_portions = None
    best_score = float("inf")

    for start in starting_points:
        portions, score = coordinate_descent(start)

        if score < best_score:
            best_score = score
            best_portions = portions

    return {
        "portions": best_portions,
        "score": round(best_score, 6),
    }