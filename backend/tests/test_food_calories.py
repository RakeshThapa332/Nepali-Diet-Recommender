from app.services.food_calories import (
    calculate_food_calories,
    calculate_portion_calories,
)


def test_calculate_food_calories():
    calories = calculate_food_calories(
        protein=10,
        fat=5,
        carbs=20,
    )

    assert calories == 165.0


def test_calculate_portion_calories():
    calories = calculate_portion_calories(
        protein=10,
        fat=5,
        carbs=20,
        portion_grams=200,
    )

    assert calories == 330.0