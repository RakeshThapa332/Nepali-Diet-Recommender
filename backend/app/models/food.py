from app.extensions import db


class Food(db.Model):
    __tablename__ = "foods"

    id = db.Column(db.Integer, primary_key=True)

    # Original dataset identifier
    sn = db.Column(db.Integer, nullable=False)

    # Food information
    food_name = db.Column(db.String(200), nullable=False)
    food_name_clean = db.Column(db.String(200))

    # Nutritional information per 100g
    protein = db.Column(db.Float)
    fat = db.Column(db.Float)
    carbs = db.Column(db.Float)
    fiber = db.Column(db.Float)
    calories = db.Column(db.Float)

    # Minerals / vitamins
    calcium = db.Column(db.Float)
    iron = db.Column(db.Float)
    vitamin_c = db.Column(db.Float)

    # Meal categories
    breakfast = db.Column(db.Boolean, default=False, nullable=False)
    lunch = db.Column(db.Boolean, default=False, nullable=False)
    dinner = db.Column(db.Boolean, default=False, nullable=False)

    # K-Means clusters
    # A food may have a different cluster for each meal.
    breakfast_cluster = db.Column(db.Integer, nullable=True)
    lunch_cluster = db.Column(db.Integer, nullable=True)
    dinner_cluster = db.Column(db.Integer, nullable=True)