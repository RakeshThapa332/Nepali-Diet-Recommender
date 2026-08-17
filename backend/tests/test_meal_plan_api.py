import pytest

from app import create_app
from app.extensions import db
from app.models import User, UserProfile, MealPlan, MealPlanItem, Food


@pytest.fixture
def app():
    app = create_app()

    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        JWT_SECRET_KEY="test-secret-key",
    )

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def test_user(app):
    with app.app_context():

        user = User(
            name="Test User",
            email="test@example.com",
            password_hash="test-password",
        )

        db.session.add(user)
        db.session.commit()

        return user.id


@pytest.fixture
def test_food(app):
    with app.app_context():

        food = Food(
            sn=9999,
            food_name="Test Rice",
            food_name_clean="test rice",
            protein=7.0,
            fat=1.0,
            carbs=28.0,
            calories=149.0,
            breakfast=True,
            lunch=True,
            dinner=True,
        )

        db.session.add(food)
        db.session.commit()

        return food.id


@pytest.fixture
def auth_headers(client, test_user):
    """
    Replace this login section with your actual
    authentication endpoint/request fields if they
    differ from these.
    """

    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "test-password",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    token = data.get("access_token")

    assert token is not None

    return {
        "Authorization": f"Bearer {token}"
    }


def create_test_meal_plan(
    app,
    user_id,
    food_id,
):
    """
    Create a saved meal plan directly in the database.
    """

    with app.app_context():

        meal_plan = MealPlan(
            user_id=user_id,
            target_calories=2000,
            macro_split={
                "daily_macros": {
                    "protein": 150,
                    "fat": 60,
                    "carbs": 200,
                },
                "meal_calories": {
                    "breakfast": 500,
                    "lunch": 800,
                    "dinner": 700,
                },
                "meal_macros": {
                    "breakfast": {
                        "protein": 37.5,
                        "fat": 15,
                        "carbs": 50,
                    },
                    "lunch": {
                        "protein": 60,
                        "fat": 24,
                        "carbs": 80,
                    },
                    "dinner": {
                        "protein": 52.5,
                        "fat": 21,
                        "carbs": 70,
                    },
                },
            },
        )

        db.session.add(meal_plan)
        db.session.flush()

        item = MealPlanItem(
            meal_plan_id=meal_plan.id,
            food_id=food_id,
            meal_type="breakfast",
            serving_size=100,
            calories=149,
            protein=7,
            fat=1,
            carbs=28,
        )

        db.session.add(item)
        db.session.commit()

        return meal_plan.id


def test_unauthenticated_today_meal_plan(client):
    response = client.get(
        "/api/meal-plans/today"
    )

    assert response.status_code == 401


def test_unauthenticated_all_meal_plans(client):
    response = client.get(
        "/api/meal-plans"
    )

    assert response.status_code == 401


def test_unauthenticated_single_meal_plan(client):
    response = client.get(
        "/api/meal-plans/1"
    )

    assert response.status_code == 401


def test_get_today_meal_plan(
    app,
    client,
    test_user,
    test_food,
    auth_headers,
):
    meal_plan_id = create_test_meal_plan(
        app=app,
        user_id=test_user,
        food_id=test_food,
    )

    response = client.get(
        "/api/meal-plans/today",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True

    meal_plan = data["meal_plan"]

    assert meal_plan["meal_plan_id"] == meal_plan_id
    assert meal_plan["target_calories"] == 2000

    assert "breakfast" in meal_plan["meals"]

    breakfast = meal_plan["meals"]["breakfast"]

    assert len(breakfast["foods"]) == 1

    food = breakfast["foods"][0]

    assert food["food_name"] == "Test Rice"
    assert food["portion_grams"] == 100
    assert food["calories"] == 149
    assert food["protein"] == 7
    assert food["fat"] == 1
    assert food["carbs"] == 28


def test_get_all_meal_plans(
    app,
    client,
    test_user,
    test_food,
    auth_headers,
):
    create_test_meal_plan(
        app=app,
        user_id=test_user,
        food_id=test_food,
    )

    response = client.get(
        "/api/meal-plans",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert len(data["meal_plans"]) == 1

    assert (
        data["meal_plans"][0]["target_calories"]
        == 2000
    )


def test_get_single_meal_plan(
    app,
    client,
    test_user,
    test_food,
    auth_headers,
):
    meal_plan_id = create_test_meal_plan(
        app=app,
        user_id=test_user,
        food_id=test_food,
    )

    response = client.get(
        f"/api/meal-plans/{meal_plan_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True

    meal_plan = data["meal_plan"]

    assert meal_plan["meal_plan_id"] == meal_plan_id


def test_nonexistent_meal_plan_returns_404(
    client,
    auth_headers,
):
    response = client.get(
        "/api/meal-plans/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False


def test_nutrition_snapshot_is_preserved(
    app,
    client,
    test_user,
    test_food,
    auth_headers,
):
    meal_plan_id = create_test_meal_plan(
        app=app,
        user_id=test_user,
        food_id=test_food,
    )

    # Change Food table nutrition AFTER
    # the meal plan has been saved.
    with app.app_context():

        food = db.session.get(
            Food,
            test_food,
        )

        food.calories = 999
        food.protein = 50
        food.fat = 50
        food.carbs = 50

        db.session.commit()

    response = client.get(
        f"/api/meal-plans/{meal_plan_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    food_data = data["meal_plan"]["meals"][
        "breakfast"
    ]["foods"][0]

    # Must still use the original snapshot.
    assert food_data["calories"] == 149
    assert food_data["protein"] == 7
    assert food_data["fat"] == 1
    assert food_data["carbs"] == 28


def test_user_cannot_access_another_users_meal_plan(
    app,
    client,
    test_user,
    test_food,
    auth_headers,
):
    with app.app_context():

        another_user = User(
            name="Another User",
            email="another@example.com",
            password_hash="another-password",
        )

        db.session.add(another_user)
        db.session.commit()

        another_user_id = another_user.id

    other_plan_id = create_test_meal_plan(
        app=app,
        user_id=another_user_id,
        food_id=test_food,
    )

    response = client.get(
        f"/api/meal-plans/{other_plan_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False