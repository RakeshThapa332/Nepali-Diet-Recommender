from app.services.recommendation import (
    predict_cluster,
    get_cluster_foods,
    add_food_calories,
)

from app.services.portion import (
    calculate_portion_grams,
    calculate_portion_calories,
)


MEAL_NAMES = {
    "breakfast": "Breakfast",
    "lunch": "Lunch",
    "dinner": "Dinner",
}


def recommend_meal(
    meal: str,
    target_calories: float,
    protein: float,
    fat: float,
    carbs: float,
    number_of_foods: int = 3,
):
    """
    Generate food recommendations for one meal.

    Steps:
        1. Predict the nutritional cluster using K-Means.
        2. Get foods belonging to that cluster.
        3. Calculate calories per 100 g.
        4. Select foods from the cluster.
        5. Distribute the meal calorie target among them.
        6. Calculate the required portion for each food.
    """

    meal = meal.strip().lower()

    if meal not in MEAL_NAMES:
        raise ValueError(
            "Meal must be breakfast, lunch, or dinner."
        )

    if target_calories <= 0:
        raise ValueError(
            "Target calories must be greater than 0."
        )

    if number_of_foods <= 0:
        raise ValueError(
            "Number of foods must be greater than 0."
        )

    # 1. Predict nutritional cluster
    cluster_id = predict_cluster(
        meal=meal,
        protein=protein,
        fat=fat,
        carbs=carbs,
    )
    # 2. Get foods from predicted cluster

    foods = get_cluster_foods(
        meal=meal,
        cluster_id=cluster_id,
    )

    if not foods:
        return {
            "meal": meal,
            "cluster_id": cluster_id,
            "target_calories": round(target_calories, 2),
            "recommendations": [],
        }
    # 3. Calculate calories for foods

    foods_with_calories = add_food_calories(foods)

    if not foods_with_calories:
        return {
            "meal": meal,
            "cluster_id": cluster_id,
            "target_calories": round(target_calories, 2),
            "recommendations": [],
        }

    # 4. Select foods

    selected_foods = foods_with_calories[:number_of_foods]

    # Divide the target calories equally among foods
    calories_per_food = (
        target_calories / len(selected_foods)
    )

    recommendations = []

    # 5. Calculate portions

    for item in selected_foods:

        food = item["food"]
        calories_per_100g = item["calories_per_100g"]

        portion_grams = calculate_portion_grams(
            calories_per_100g=calories_per_100g,
            target_calories=calories_per_food,
        )

        actual_calories = calculate_portion_calories(
            calories_per_100g=calories_per_100g,
            portion_grams=portion_grams,
        )

        recommendations.append({
            "food_id": food.id,
            "food_name": food.food_name,
            "portion_grams": portion_grams,
            "calories_per_100g": calories_per_100g,
            "calories": actual_calories,
        })

    total_calories = sum(
        item["calories"]
        for item in recommendations
    )

    return {
        "meal": meal,
        "cluster_id": cluster_id,
        "target_calories": round(target_calories, 2),
        "total_recommended_calories": round(
            total_calories,
            2
        ),
        "recommendations": recommendations,
    }