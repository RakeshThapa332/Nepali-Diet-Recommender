from datetime import date, datetime, timezone
from app.extensions import db

class MealPlan(db.Model):
    __tablename__ = "meal_plans"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date = db.Column(db.Date, default=date.today)
    target_calories = db.Column(db.Float)
    macro_split = db.Column(db.JSON)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


    items = db.relationship(
        "MealPlanItem",
        backref="meal_plan",
        cascade="all, delete-orphan"
    )