"""
Configuration file for RankCatalyst backend
Contains all environment variables and settings that would normally be in .env
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# config.py is in backend/, so parent.parent gets us to backend/
BASE_DIR = Path(__file__).resolve().parent

# OpenRouter API Configuration
OPENROUTER_API_KEY = "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"  # Replace with actual key
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

