from datetime import datetime, timezone

from app.extensions import db


class FoodIntakeLog(db.Model):
    __tablename__ = "food_intake_logs"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    food_id = db.Column(
        db.Integer,
        db.ForeignKey("foods.id"),
        nullable=False
    )

    quantity_g = db.Column(
        db.Float,
        nullable=False
    )

    meal_type = db.Column(
        db.String(30),
        nullable=False
    )

    consumed_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True
    )