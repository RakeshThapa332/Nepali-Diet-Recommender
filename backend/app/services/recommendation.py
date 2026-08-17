import os
import joblib
import pandas as pd

from app.models import Food
from app.services.food_calories import calculate_food_calories

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../")
)

MODEL_DIR = os.path.join(BASE_DIR, "models")


MEAL_CONFIG = {
    "breakfast": {
        "model": "breakfast_kmeans.joblib",
        "scaler": "breakfast_scaler.joblib",
        "cluster_column": "breakfast_cluster",
    },
    "lunch": {
        "model": "lunch_kmeans.joblib",
        "scaler": "lunch_scaler.joblib",
        "cluster_column": "lunch_cluster",
    },
    "dinner": {
        "model": "dinner_kmeans.joblib",
        "scaler": "dinner_scaler.joblib",
        "cluster_column": "dinner_cluster",
    },
}


FEATURES = [
    "protein",
    "fat",
    "carbs",
]


def load_meal_model(meal):
    """
    Load the trained K-Means model and scaler
    for a particular meal.
    """

    if meal not in MEAL_CONFIG:
        raise ValueError(
            f"Unsupported meal: {meal}"
        )

    config = MEAL_CONFIG[meal]

    model_path = os.path.join(
        MODEL_DIR,
        config["model"]
    )

    scaler_path = os.path.join(
        MODEL_DIR,
        config["scaler"]
    )

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found: {model_path}"
        )

    if not os.path.exists(scaler_path):
        raise FileNotFoundError(
            f"Scaler not found: {scaler_path}"
        )

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    return model, scaler


def get_meal_foods(meal):
    """
    Get foods available for a particular meal.
    """

    if meal not in MEAL_CONFIG:
        raise ValueError(
            f"Unsupported meal: {meal}"
        )

    return Food.query.filter(
        getattr(Food, meal) == True
    ).all()

#Cluster Prediction
def predict_cluster(
    meal,
    protein,
    fat,
    carbs
):
    """
    Predict the most suitable nutritional cluster
    using the trained K-Means model.
    """

    model, scaler = load_meal_model(meal)

    values = pd.DataFrame([[
        protein,
        fat,
        carbs
    ]], columns=FEATURES)

    values_scaled = scaler.transform(values)

    cluster = model.predict(values_scaled)[0]

    return int(cluster)

#get-f00ds-from-cluster
def get_cluster_foods(
    meal,
    cluster_id
):
    """
    Return foods belonging to the selected
    meal-specific cluster.
    """

    config = MEAL_CONFIG[meal]

    cluster_column = getattr(
        Food,
        config["cluster_column"]
    )

    foods = Food.query.filter(
        getattr(Food, meal) == True,
        cluster_column == cluster_id
    ).all()

    return foods

def add_food_calories(foods):
    """
    Calculate calories per 100 g for each food
    using the Atwater factors.
    """

    results = []

    for food in foods:

        if (
            food.protein is None
            or food.fat is None
            or food.carbs is None
        ):
            continue

        calories = calculate_food_calories(
            protein=food.protein,
            fat=food.fat,
            carbs=food.carbs,
        )

        results.append({
            "food": food,
            "calories_per_100g": calories,
        })

    return results