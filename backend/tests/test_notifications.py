import pytest

from app import create_app
from app.extensions import db
from app.models import User, UserSettings, Notification
from app.services.notification_scheduler import send_due_meal_notifications


@pytest.fixture
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        JWT_SECRET_KEY="test-secret-key",
    )

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_sends_breakfast_notification_when_due(app):
    with app.app_context():
        user = User(
            name="Reminder User",
            email="reminder@example.com",
            password_hash="secret",
        )
        db.session.add(user)
        db.session.flush()

        settings = UserSettings(
            user_id=user.id,
            notifications_enabled=True,
            breakfast_enabled=True,
            breakfast_time="08:00",
            lunch_enabled=True,
            lunch_time="12:30",
            dinner_enabled=True,
            dinner_time="19:30",
        )
        db.session.add(settings)
        db.session.commit()

        import datetime as dt

        now = dt.datetime.now()
        settings.breakfast_time = now.strftime("%H:%M")
        db.session.commit()

        send_due_meal_notifications()

        notifications = Notification.query.filter_by(
            user_id=user.id,
            notification_type="breakfast_reminder",
        ).all()

        assert len(notifications) == 1
        assert "Breakfast" in notifications[0].title
