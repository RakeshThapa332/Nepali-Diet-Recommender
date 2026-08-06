from app.services.bmr import calculate_bmr

def run_tests():
    print("=" * 50)
    print("BMR Service Tests")
    print("=" * 50)

    # Test 1: Male
    bmr = calculate_bmr(
        age=22,
        gender="male",
        weight_kg=70,
        height_cm=175
    )
    print(f"Test 1 (Male): {bmr} kcal/day")

    # Test 2: Female
    bmr = calculate_bmr(
        age=25,
        gender="female",
        weight_kg=60,
        height_cm=165
    )
    print(f"Test 2 (Female): {bmr} kcal/day")

    # Test 3: Mixed case gender
    bmr = calculate_bmr(
        age=30,
        gender="Male",
        weight_kg=80,
        height_cm=180
    )
    print(f"Test 3 (Mixed Case): {bmr} kcal/day")

    # Test 4: Invalid age
    try:
        calculate_bmr(
            age=0,
            gender="male",
            weight_kg=70,
            height_cm=175
        )
    except ValueError as e:
        print(f"Test 4 Passed: {e}")

    # Test 5: Invalid weight
    try:
        calculate_bmr(
            age=22,
            gender="male",
            weight_kg=0,
            height_cm=175
        )
    except ValueError as e:
        print(f"Test 5 Passed: {e}")

    # Test 6: Invalid height
    try:
        calculate_bmr(
            age=22,
            gender="male",
            weight_kg=70,
            height_cm=0
        )
    except ValueError as e:
        print(f"Test 6 Passed: {e}")

    # Test 7: Invalid gender
    try:
        calculate_bmr(
            age=22,
            gender="other",
            weight_kg=70,
            height_cm=175
        )
    except ValueError as e:
        print(f"Test 7 Passed: {e}")


if __name__ == "__main__":
    run_tests()