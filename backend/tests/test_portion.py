from app.services.portion import (
    calculate_portion_grams,
    calculate_portion_calories,
)


def test_calculate_portion_grams():
    portion = calculate_portion_grams(
        calories_per_100g=400,
        target_calories=200,
    )

    assert portion == 50.0


def test_calculate_portion_calories():
    calories = calculate_portion_calories(
        calories_per_100g=400,
        portion_grams=50,
    )

    assert calories == 200.0