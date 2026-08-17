from app import create_app
from app.services.meal_recommender import recommend_meal


app = create_app()


with app.app_context():

    result = recommend_meal(
        meal="breakfast",

        # Example nutritional target
        target_calories=654.39,

        # Example nutritional profile for cluster prediction
        protein=20,
        fat=15,
        carbs=80,

        number_of_foods=3,
    )

    print("\n" + "=" * 60)
    print("RECOMMENDATION TEST")
    print("=" * 60)

    print("Meal:", result["meal"])
    print("Cluster:", result["cluster_id"])
    print("Target calories:", result["target_calories"])
    print(
        "Total recommended calories:",
        result["total_recommended_calories"]
    )

    print("\nFoods:")

    for food in result["recommendations"]:
        print(
            f"- {food['food_name']}: "
            f"{food['portion_grams']} g | "
            f"{food['calories']} kcal"
        )

    print("=" * 60)