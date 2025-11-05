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
    load_dotenv(env_path)
    print(f"Loaded .env file from {env_path}")
else:
    print(f"Warning: .env file not found at {env_path}")

# OpenRouter API Configuration
# Read API key from .env file, fallback to empty string if not found
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "openai/gpt-4o-mini"

# Django Settings
SECRET_KEY = "django-insecure-rankcatalyst-dev-key-change-in-production-2024"
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Site Info for OpenRouter
SITE_URL = "http://localhost:3000"  # Frontend URL
SITE_NAME = "RankCatalyst"

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True  # Dev only - change in production
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

