from app.services.food_ranking import (
    calculate_food_fit_score,
    calculate_combination_score,
)


class MockFood:

    def __init__(
        self,
        protein,
        fat,
        carbs,
    ):
        self.protein = protein
        self.fat = fat
        self.carbs = carbs


def test_food_fit_score():

    food = MockFood(
        protein=20,
        fat=10,
        carbs=30,
    )

    score = calculate_food_fit_score(
        food=food,
        target_calories=300,
        target_protein=20,
        target_fat=10,
        target_carbs=30,
    )

    assert score == 0


def test_combination_score():

    foods = [
        MockFood(10, 5, 20),
        MockFood(20, 10, 30),
        MockFood(15, 5, 25),
    ]

    score = calculate_combination_score(
        foods=foods,
        target_calories=500,
        target_protein=45,
        target_fat=20,
        target_carbs=75,
    )

    assert score >= 0