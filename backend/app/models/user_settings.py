from datetime import datetime, timezone

from app.extensions import db


class UserSettings(db.Model):
    __tablename__ = "user_settings"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    # Notification master switch
    notifications_enabled = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    # Meal reminders
    breakfast_enabled = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    breakfast_time = db.Column(
        db.String(5),
        default="08:00",
        nullable=False
    )

    lunch_enabled = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    lunch_time = db.Column(
        db.String(5),
        default="12:30",
        nullable=False
    )

    dinner_enabled = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    dinner_time = db.Column(
        db.String(5),
        default="19:30",
        nullable=False
    )

    # Other notifications
    weekly_progress_enabled = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    recommendation_enabled = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )