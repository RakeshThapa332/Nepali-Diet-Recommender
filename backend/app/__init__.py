from flask import Flask

from app.config.config import Config
from app.extensions import db, migrate, jwt, cors


def create_app():
    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    @app.route("/")
    def home():
        return {
            "message": "Diet Recommendation System Backend is Running!",
            "status": "success"
        }

    return app