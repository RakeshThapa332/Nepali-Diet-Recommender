from app.services.nutrition import (
    calculate_target_calories,
    generate_nutrition_summary,
)


def run_tests():
    print("=" * 60)
    print("Testing Nutrition Service")
    print("=" * 60)

    # Test 1: Weight Loss
    calories = calculate_target_calories(
        tdee=2500,
        goal="weight_loss"
    )
    print(f"Weight Loss Target: {calories} kcal/day")

    # Test 2: Maintenance
    calories = calculate_target_calories(
        tdee=2500,
        goal="maintenance"
    )
    print(f"Maintenance Target: {calories} kcal/day")

    # Test 3: Weight Gain
    calories = calculate_target_calories(
        tdee=2500,
        goal="weight_gain"
    )
    print(f"Weight Gain Target: {calories} kcal/day")

    print("\nTesting Full Nutrition Summary\n")

    summary = generate_nutrition_summary(
        age=22,
        gender="male",
        weight_kg=70,
        height_cm=175,
        activity_level="moderately_active",
        goal="maintenance",
    )

    for key, value in summary.items():
        print(f"{key}: {value}")

    print("\nTesting Invalid Goal...")

    try:
        calculate_target_calories(
            tdee=2500,
            goal="bulk"
        )
    except ValueError as e:
        print(f"Caught Error: {e}")

    print("\nTesting Invalid TDEE...")

    try:
        calculate_target_calories(
            tdee=-100,
            goal="maintenance"
        )
    except ValueError as e:
        print(f"Caught Error: {e}")


if __name__ == "__main__":
    run_tests()