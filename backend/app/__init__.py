import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from .config import get_config
from .models import Base
from .routes import api_bp
from dotenv import load_dotenv

engine = None
SessionLocal = None


def create_app() -> Flask:
    # Load environment from .env if present
    load_dotenv()
    global engine, SessionLocal
    app = Flask(__name__)
    app.config.from_object(get_config())

    # Database
    database_url = app.config['DATABASE_URL']
    engine = create_engine(database_url, pool_pre_ping=True)
    SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

    # Create tables if not exist (SQLite dev convenience)
    Base.metadata.create_all(bind=engine)

    # CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS'].split(',')}})

    # Attach session to app for access in routes
    app.session_factory = SessionLocal  # type: ignore

    # Blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        SessionLocal.remove()

    return app
