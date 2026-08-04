from app.extensions import db


class MealPlanItem(db.Model):
    __tablename__ = "meal_plan_items"

    id = db.Column(db.Integer, primary_key=True)
    meal_plan_id = db.Column(
        db.Integer,
        db.ForeignKey("meal_plans.id"),
        nullable=False
    )
    food_id = db.Column(
        db.Integer,
        db.ForeignKey("foods.id"),
        nullable=False
    )
    meal_type = db.Column(db.String(30))
    serving_size = db.Column(db.Float)


    food = db.relationship("Food")