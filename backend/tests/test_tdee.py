from app.services.tdee import calculate_tdee


def run_tests():
    print("=" * 50)
    print("Testing TDEE Calculator")
    print("=" * 50)

    # Test 1
    tdee = calculate_tdee(1648.75, "sedentary")
    print(f"Sedentary: {tdee} kcal/day")

    # Test 2
    tdee = calculate_tdee(1648.75, "lightly_active")
    print(f"Lightly Active: {tdee} kcal/day")

    # Test 3
    tdee = calculate_tdee(1648.75, "moderately_active")
    print(f"Moderately Active: {tdee} kcal/day")

    # Test 4
    tdee = calculate_tdee(1648.75, "very_active")
    print(f"Very Active: {tdee} kcal/day")

    # Test 5
    tdee = calculate_tdee(1648.75, "extra_active")
    print(f"Extra Active: {tdee} kcal/day")

    print("\nTesting invalid activity level...")

    try:
        calculate_tdee(1648.75, "super_active")
    except ValueError as e:
        print(f"Caught Error: {e}")

    print("\nTesting invalid BMR...")

    try:
        calculate_tdee(-100, "sedentary")
    except ValueError as e:
        print(f"Caught Error: {e}")


if __name__ == "__main__":
    run_tests()