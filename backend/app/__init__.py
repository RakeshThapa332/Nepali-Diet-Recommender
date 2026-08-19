import threading
import time

from flask import Flask

from app.config.config import Config
from app.extensions import db, migrate, jwt, cors, limiter
from app.routes.auth import auth_bp
from app.routes.profile import profile_bp
from app.routes.settings import settings_bp
from app.routes.history import history_bp
from app.routes.notifications import notifications_bp
from app.routes.recommendation import recommendation_bp
from app.routes.meal_plans import meal_plan_bp
from app.routes.food import food_bp


def start_notification_worker(app):
    """Checks saved meal times every minute and creates notifications when due."""

    worker = threading.Thread(
        target=_notification_worker_loop,
        args=(app,),
        daemon=True,
        name="meal-notification-worker",
    )
    worker.start()


def _notification_worker_loop(app):
    while True:
        try:
            with app.app_context():
                from app.services.notification_scheduler import send_due_meal_notifications

                send_due_meal_notifications()
        except Exception:
            pass

        time.sleep(60)


def create_app():
    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)

    #Import models to SQLAlchemy
    from app.models import (
        User,
        UserProfile,
        Food,
        MealPlan,
        MealPlanItem,
        UserSettings,
        Notification,
    )

    @app.route("/")
    def home():
        return {
            "message": "Diet Recommendation System Backend is Running!",
            "status": "success"
        }

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(meal_plan_bp)
    app.register_blueprint(food_bp)

    if not app.config.get("TESTING"):
        app.config.setdefault("_meal_notification_worker_started", False)
        if not app.config["_meal_notification_worker_started"]:
            start_notification_worker(app)
            app.config["_meal_notification_worker_started"] = True

    return app