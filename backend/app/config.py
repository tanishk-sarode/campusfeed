import os


class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
    # Default to SQLite; override to MySQL with:
    # mysql+pymysql://user:password@host:3306/dbname
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    # CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3001')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')


def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    return BaseConfig
