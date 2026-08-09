from app.extensions import db


class Food(db.Model):
    __tablename__ = "foods"

    id = db.Column(db.Integer, primary_key=True)

    # Food information
    food_name = db.Column(db.String(150), nullable=False)
    edible_portion = db.Column(db.Float)

    # Macronutrients / composition
    moisture = db.Column(db.Float)
    protein = db.Column(db.Float)
    fat = db.Column(db.Float)
    carbohydrate = db.Column(db.Float)
    minerals = db.Column(db.Float)
    fiber = db.Column(db.Float)

    # Energy
    energy = db.Column(db.Float)

    # Minerals
    calcium = db.Column(db.Float)
    phosphorus = db.Column(db.Float)
    iron = db.Column(db.Float)

    # Vitamins
    carotene = db.Column(db.Float)
    vitamin_c = db.Column(db.Float)
    thiamine = db.Column(db.Float)
    riboflavin = db.Column(db.Float)
    niacin = db.Column(db.Float)

    # Generated later by ML
    cluster_id = db.Column(db.Integer)