
from app import create_app

from app.services.daily_recommendation import (
    generate_daily_recommendation,
)


app = create_app()


with app.app_context():


    meal_calories = {
        "breakfast": 654.39,
        "lunch": 1047.02,
        "dinner": 916.15,
    }


    result = generate_daily_recommendation(
        meal_calories=meal_calories,
        target_calories=2617.56,
        body_type="endomorphic",
        number_of_foods=3,
    )


    print("\n" + "=" * 60)
    print("DAILY DIET RECOMMENDATION")
    print("=" * 60)

    print(
        f"Target calories: "
        f"{result['target_calories']} kcal"
    )

    print("\nDAILY MACRO TARGETS")

    print(
        f"Protein: "
        f"{result['daily_macros']['protein']} g"
    )

    print(
        f"Fat: "
        f"{result['daily_macros']['fat']} g"
    )

    print(
        f"Carbs: "
        f"{result['daily_macros']['carbs']} g"
    )

    print("\nMEAL MACRO TARGETS")

    for meal in ["breakfast", "lunch", "dinner"]:

        macros = result["meal_macros"][meal]

        print("\n" + "-" * 60)
        print(meal.upper())

        print(
            f"Protein: {macros['protein']} g"
        )

        print(
            f"Fat: {macros['fat']} g"
        )

        print(
            f"Carbs: {macros['carbs']} g"
        )

    for meal, recommendation in result["meals"].items():

        print("\n" + "=" * 60)

        print(
            f"{meal.upper()} "
            f"({recommendation['target_calories']} kcal)"
        )

        print(
            f"Cluster: "
            f"{recommendation['cluster_id']}"
        )

        target_macros = recommendation["target_macros"]

        print(
            "Target macros: "
            f"Protein {target_macros['protein']} g | "
            f"Fat {target_macros['fat']} g | "
            f"Carbs {target_macros['carbs']} g"
        )

        print("\nRecommended foods:")

        for food in recommendation["foods"]:

            print(
                f"- {food['food_name']}: "
                f"{food['portion_grams']} g | "
                f"{food['calories']} kcal "
                f"({food['calories_per_100g']} kcal/100g)"
            )

        print(
            f"\nTotal meal calories: "
            f"{recommendation['total_calories']} kcal"
        )


    print("\n" + "=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)

    total_recommended_calories = sum(
        recommendation["total_calories"]
        for recommendation in result["meals"].values()
    )

    print(
        f"Target daily calories: "
        f"{result['target_calories']} kcal"
    )

    print(
        f"Recommended daily calories: "
        f"{round(total_recommended_calories, 2)} kcal"
    )

    print(
        f"Difference: "
        f"{round(total_recommended_calories - result['target_calories'], 2)} kcal"
    )

    print("=" * 60)
    print("RECOMMENDATION TEST COMPLETED")
    print("=" * 60)
