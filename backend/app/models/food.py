from app.extensions import db


class Food(db.Model):
    __tablename__ = "foods"

    id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(150), nullable=False)
    food_name_nepali = db.Column(db.String(150))
    category = db.Column(db.String(50))
    calories = db.Column(db.Float)
    protein = db.Column(db.Float)
    fat = db.Column(db.Float)
    carbs = db.Column(db.Float)
    fiber = db.Column(db.Float)
    calcium = db.Column(db.Float)
    iron = db.Column(db.Float)
    vitamin_a = db.Column(db.Float)
    vitamin_c = db.Column(db.Float)
    sodium = db.Column(db.Float)
    potassium = db.Column(db.Float)
    cluster_id = db.Column(db.Integer)