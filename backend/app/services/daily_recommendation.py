import random

from app.services.macros import calculate_macro_targets
from app.services.meal_distribution import calculate_meal_macros
from app.services.recommendation import (
    predict_cluster,
    get_cluster_foods,
)
from app.services.food_ranking import find_best_food_combination
from app.services.portion_optimizer import optimize_food_portions
from app.services.food_calories import calculate_food_calories


MEALS = [
    "breakfast",
    "lunch",
    "dinner",
]


def recommend_meal(
    meal: str,
    target_calories: float,
    protein: float,
    fat: float,
    carbs: float,
    number_of_foods: int = 3,
    recent_food_ids=None,
):
    """
    Generate one meal recommendation.

    Pipeline:

    1. Predict nutritional K-Means cluster.
    2. Retrieve foods from that cluster.
    3. Build a larger candidate pool.
    4. Randomly select a nutritionally suitable combination.
    5. Optimize portions.
    6. Return the final meal.

    Randomized selection means regeneration can produce
    a different meal instead of repeatedly returning the
    same foods.
    """

    meal = meal.strip().lower()

    if meal not in MEALS:
        raise ValueError(
            f"Unsupported meal: {meal}"
        )

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    if number_of_foods != 3:
        raise ValueError(
            "Currently exactly 3 foods are recommended per meal."
        )


    cluster_id = predict_cluster(
        meal=meal,
        protein=protein,
        fat=fat,
        carbs=carbs,
    )


    foods = get_cluster_foods(
        meal=meal,
        cluster_id=cluster_id,
    )

    if not foods:
        raise ValueError(
            f"No foods found for {meal} cluster {cluster_id}."
        )

    valid_foods = []

    for food in foods:

        calories_per_100g = calculate_food_calories(
            protein=food.protein or 0,
            fat=food.fat or 0,
            carbs=food.carbs or 0,
        )

        if calories_per_100g <= 0:
            continue

        valid_foods.append(food)

    if len(valid_foods) < number_of_foods:
        raise ValueError(
            f"Not enough valid foods available for {meal}."
        )


    shuffled_foods = valid_foods.copy()

    random.shuffle(shuffled_foods)


    candidate_pool = shuffled_foods[:20]


    combination = find_best_food_combination(
        foods=candidate_pool,
        target_calories=target_calories,
        target_protein=protein,
        target_fat=fat,
        target_carbs=carbs,
        number_of_foods=number_of_foods,
        recent_food_ids=recent_food_ids,
    )

    selected_foods = combination["foods"]

    if len(selected_foods) != number_of_foods:
        raise ValueError(
            f"Could not select {number_of_foods} foods for {meal}."
        )


    optimized = optimize_food_portions(
        foods=selected_foods,
        target_calories=target_calories,
        target_protein=protein,
        target_fat=fat,
        target_carbs=carbs,
        min_portion=30,
        max_portion=250,
        step=5,
    )

    portions = optimized["portions"]


    recommendations = []

    total_calories = 0.0
    total_protein = 0.0
    total_fat = 0.0
    total_carbs = 0.0

    for food, portion in zip(
        selected_foods,
        portions,
    ):

        protein_amount = (
            (food.protein or 0)
            * portion
            / 100
        )

        fat_amount = (
            (food.fat or 0)
            * portion
            / 100
        )

        carbs_amount = (
            (food.carbs or 0)
            * portion
            / 100
        )

        calories_per_100g = calculate_food_calories(
            protein=food.protein or 0,
            fat=food.fat or 0,
            carbs=food.carbs or 0,
        )

        calories = (
            calories_per_100g
            * portion
            / 100
        )

        total_calories += calories
        total_protein += protein_amount
        total_fat += fat_amount
        total_carbs += carbs_amount

        recommendations.append({
            "food_id": food.id,
            "food_name": food.food_name,

            "portion_grams": round(
                portion,
                2,
            ),

            "calories": round(
                calories,
                2,
            ),

            "calories_per_100g": round(
                calories_per_100g,
                2,
            ),

            "protein": round(
                protein_amount,
                2,
            ),

            "fat": round(
                fat_amount,
                2,
            ),

            "carbs": round(
                carbs_amount,
                2,
            ),
        })


    return {
        "meal": meal,

        "cluster_id": cluster_id,

        "target_calories": round(
            target_calories,
            2,
        ),

        "target_macros": {
            "protein": round(
                protein,
                2,
            ),
            "fat": round(
                fat,
                2,
            ),
            "carbs": round(
                carbs,
                2,
            ),
        },

        "foods": recommendations,

        "total_calories": round(
            total_calories,
            2,
        ),

        "total_macros": {
            "protein": round(
                total_protein,
                2,
            ),
            "fat": round(
                total_fat,
                2,
            ),
            "carbs": round(
                total_carbs,
                2,
            ),
        },

        "fit_score": optimized["score"],
    }

def generate_daily_recommendation(
    meal_calories: dict,
    target_calories: float,
    body_type: str,
    number_of_foods: int = 3,
    recent_food_ids=None,
):
    """
    Generate a complete daily diet recommendation.

    Process:

    1. Calculate daily macro requirements.
    2. Distribute daily macros among breakfast,
       lunch and dinner.
    3. Generate meal-specific K-Means clusters.
    4. Select 3 foods from each meal cluster.
    5. Calculate portions according to meal calories.

    Returns:

        Daily target calories
        Daily macros
        Meal-specific calories
        Meal-specific macros
        Breakfast → 3 foods
        Lunch     → 3 foods
        Dinner    → 3 foods
    """

    #Calculate daily macro requirements

    macros = calculate_macro_targets(
        target_calories=target_calories,
        body_type=body_type,
    )

    daily_protein = macros["protein"]
    daily_fat = macros["fat"]
    daily_carbs = macros["carbs"]

    #Distribute daily macros among meals
    meal_macros = calculate_meal_macros(
        protein=daily_protein,
        fat=daily_fat,
        carbs=daily_carbs,
    )

    
    #Generate B/L/D recommendations
    recommendations = {}

    for meal in MEALS:

        if meal not in meal_calories:
            raise ValueError(
                f"Missing calories for {meal}."
            )

        current_meal_macros = meal_macros[meal]

        recommendations[meal] = recommend_meal(
            meal=meal,
            target_calories=meal_calories[meal],

            # IMPORTANT:
            # Use meal-specific macros,
            # not full-day macros.
            protein=current_meal_macros["protein"],
            fat=current_meal_macros["fat"],
            carbs=current_meal_macros["carbs"],

            number_of_foods=number_of_foods,
            recent_food_ids=recent_food_ids,
        )


    return {
        "target_calories": round(
            target_calories,
            2
        ),

        "daily_macros": {
            "protein": round(daily_protein, 2),
            "fat": round(daily_fat, 2),
            "carbs": round(daily_carbs, 2),
        },

        "meal_calories": meal_calories,

        "meal_macros": meal_macros,

        "meals": recommendations,
    }