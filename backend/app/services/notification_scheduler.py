from datetime import datetime, timedelta, timezone

from app.extensions import db
from app.models import Notification, UserSettings


MEAL_REMINDER_CONFIG = {
    "breakfast": {
        "enabled_field": "breakfast_enabled",
        "time_field": "breakfast_time",
        "label": "Breakfast",
        "type": "breakfast_reminder",
    },
    "lunch": {
        "enabled_field": "lunch_enabled",
        "time_field": "lunch_time",
        "label": "Lunch",
        "type": "lunch_reminder",
    },
    "dinner": {
        "enabled_field": "dinner_enabled",
        "time_field": "dinner_time",
        "label": "Dinner",
        "type": "dinner_reminder",
    },
}


def _today_window_start():
    now = datetime.now(timezone.utc)
    return datetime.combine(now.date(), datetime.min.time(), tzinfo=timezone.utc)


def _parse_time(value):
    if not value:
        return None

    try:
        return datetime.strptime(value, "%H:%M").time()
    except ValueError:
        return None


def _already_sent_today(user_id, notification_type):
    start_of_today = _today_window_start()

    existing = Notification.query.filter(
        Notification.user_id == user_id,
        Notification.notification_type == notification_type,
        Notification.created_at >= start_of_today,
    ).first()

    return existing is not None


def send_due_meal_notifications():
    """Create meal reminder notifications when the saved time matches the current time."""
    now = datetime.now()
    current_minutes = now.hour * 60 + now.minute

    for settings in UserSettings.query.all():
        if not settings.notifications_enabled:
            continue

        for meal_name, config in MEAL_REMINDER_CONFIG.items():
            enabled = getattr(settings, config["enabled_field"], False)
            if not enabled:
                continue

            scheduled_time = _parse_time(getattr(settings, config["time_field"], None))
            if not scheduled_time:
                continue

            scheduled_minutes = scheduled_time.hour * 60 + scheduled_time.minute
            if abs(current_minutes - scheduled_minutes) > 2:
                continue

            if _already_sent_today(settings.user_id, config["type"]):
                continue

            notification = Notification(
                user_id=settings.user_id,
                title=f"{config['label']} reminder",
                message=(
                    f"It’s time for your {config['label'].lower()} meal. "
                    "Please log your meal and keep up with your nutrition goals."
                ),
                notification_type=config["type"],
                is_read=False,
            )

            db.session.add(notification)

    db.session.commit()
