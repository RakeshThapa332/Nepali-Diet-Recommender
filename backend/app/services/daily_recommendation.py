from app.services.macros import calculate_macro_targets
from app.services.meal_distribution import (
    calculate_meal_macros,
)
from app.services.recommendation import (
    predict_cluster,
    get_cluster_foods,
)
from app.services.food_ranking import (
    find_best_food_combination,
)

from app.services.portion_optimizer import (
    optimize_food_portions,
)
from app.services.food_calories import(
    calculate_food_calories
)

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
):
    """
    Generate recommendations for one meal.

    Process:

    1. Predict meal-specific K-Means cluster.
    2. Get foods belonging to that cluster.
    3. Find the best combination of foods.
    4. Optimize the portion sizes.
    5. Return the final recommendation.
    """

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    #Predict k-means cluster
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


    combination = find_best_food_combination(
        foods=foods,
        target_calories=target_calories,
        target_protein=protein,
        target_fat=fat,
        target_carbs=carbs,
        number_of_foods=number_of_foods,
    )

    selected_foods = combination["foods"]

    optimized = optimize_food_portions(
        foods=selected_foods,
        target_calories=target_calories,
        target_protein=protein,
        target_fat=fat,
        target_carbs=carbs,
        min_portion=25,
        max_portion=300,
        step=5,
    )

    portions = optimized["portions"]


    recommendations = []

    total_calories = 0
    total_protein = 0
    total_fat = 0
    total_carbs = 0

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
                2
            ),

            "calories": round(
                calories,
                2
            ),

            "calories_per_100g": round(
                calories_per_100g,
                2
            ),

            "protein": round(
                protein_amount,
                2
            ),

            "fat": round(
                fat_amount,
                2
            ),

            "carbs": round(
                carbs_amount,
                2
            ),
        })


    return {
        "meal": meal,

        "cluster_id": cluster_id,

        "target_calories": round(
            target_calories,
            2
        ),

        "target_macros": {
            "protein": round(protein, 2),
            "fat": round(fat, 2),
            "carbs": round(carbs, 2),
        },

        "foods": recommendations,

        "total_calories": round(
            total_calories,
            2
        ),

        "total_macros": {
            "protein": round(total_protein, 2),
            "fat": round(total_fat, 2),
            "carbs": round(total_carbs, 2),
        },

        "fit_score": optimized["score"],
    }

def generate_daily_recommendation(
    meal_calories: dict,
    target_calories: float,
    body_type: str,
    number_of_foods: int = 3,
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