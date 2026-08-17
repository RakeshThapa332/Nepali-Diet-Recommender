from app.services.portion_optimizer import (
    calculate_portion_score,
    optimize_food_portions,
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


def test_portion_score():

    food = MockFood(
        protein=20,
        fat=10,
        carbs=30,
    )

    score = calculate_portion_score(
        foods=[food],
        portions=[100],
        target_calories=290,
        target_protein=20,
        target_fat=10,
        target_carbs=30,
    )

    assert score == 0


def test_optimizer():

    foods = [
        MockFood(20, 10, 30),
        MockFood(10, 5, 20),
        MockFood(15, 8, 25),
    ]

    result = optimize_food_portions(
        foods=foods,
        target_calories=500,
        target_protein=45,
        target_fat=20,
        target_carbs=75,
        min_portion=25,
        max_portion=300,
        step=5,
    )

    assert "portions" in result
    assert "score" in result

    assert len(result["portions"]) == 3
    assert result["score"] >= 0