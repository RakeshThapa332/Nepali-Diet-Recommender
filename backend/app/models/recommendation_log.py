from datetime import datetime, timezone

from app.extensions import db


class RecommendationLog(db.Model):
    __tablename__ = "recommendation_logs"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    target_calories = db.Column(db.Float)

    goal = db.Column(db.String(50))

    cluster_id = db.Column(db.Integer)

    generated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )