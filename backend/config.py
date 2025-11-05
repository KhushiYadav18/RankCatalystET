"""
Configuration file for RankCatalyst backend
Contains all environment variables and settings that would normally be in .env
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# config.py is in backend/, so parent.parent gets us to backend/
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env file
env_path = BASE_DIR / '.env'
if env_path.exists():
    try:
        load_dotenv(env_path, encoding='utf-8')
    except UnicodeDecodeError:
        # If encoding fails, try to read manually
        try:
            with open(env_path, 'r', encoding='utf-8-sig') as f:
                for line in f:
                    if '=' in line and not line.strip().startswith('#'):
                        key, value = line.strip().split('=', 1)
                        os.environ[key] = value
        except Exception:
            print(f"Warning: Could not load .env file from {env_path}")
else:
    # In production (Render), environment variables are set directly
    # No need to warn if .env doesn't exist
    pass

# OpenRouter API Configuration
# Read API key from .env file, fallback to empty string if not found
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

# Django Settings
# SECRET_KEY is required - use environment variable or fallback to dev key
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-rankcatalyst-dev-key-change-in-production-2024")

# DEBUG mode - default to False for production safety
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

# ALLOWED_HOSTS - parse from comma-separated string or use defaults
allowed_hosts_str = os.getenv("ALLOWED_HOSTS", "")
if allowed_hosts_str:
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_str.split(",")]
else:
    # Default for development
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Site Info for OpenRouter
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")  # Frontend URL
SITE_NAME = os.getenv("SITE_NAME", "RankCatalyst")

# Database - Using SQLite (Django default)
# For Render, SQLite works but note that file-based storage has limitations
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS Settings
# CORS_ALLOW_ALL_ORIGINS - default to False for production safety
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False").lower() in ("true", "1", "yes")

# CORS_ALLOWED_ORIGINS - parse from comma-separated string
cors_origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "")
if cors_origins_str:
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_str.split(",")]
else:
    # Default for development
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

