from flask import Flask

from app.config.config import Config
from app.extensions import db, migrate, jwt, cors
from app.routes.auth import auth_bp
from app.routes.profile import profile_bp
from app.routes.settings import settings_bp
from app.routes.history import history_bp

def create_app():
    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    #Import models to SQLAlchemy
    from app.models import (
        User,
        UserProfile,
        Food,
        MealPlan,
        MealPlanItem
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

    return app