from app.services.food_ranking import (
    calculate_food_fit_score,
    calculate_combination_score,
    find_best_food_combination,
)


class MockFood:

    def __init__(
        self,
        protein,
        fat,
        carbs,
        food_id=0,
        food_name="food",
    ):
        self.id = food_id
        self.food_name = food_name
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


def test_find_best_food_combination_prefers_unseen_foods():
    foods = [
        MockFood(15, 4, 20, food_id=1, food_name="Rice"),
        MockFood(18, 5, 25, food_id=2, food_name="Oats"),
        MockFood(16, 5, 22, food_id=3, food_name="Millet"),
        MockFood(20, 6, 27, food_id=4, food_name="Chicken"),
    ]

    result = find_best_food_combination(
        foods=foods,
        target_calories=500,
        target_protein=45,
        target_fat=20,
        target_carbs=75,
        number_of_foods=3,
        recent_food_ids={1},
        top_k=20,
    )

    selected_ids = {food.id for food in result["foods"]}

    assert 1 not in selected_ids