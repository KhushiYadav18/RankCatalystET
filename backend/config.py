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
    print(f"Warning: .env file not found at {env_path}")

# OpenRouter API Configuration
# Read API key from .env file, fallback to empty string if not found
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "openai/gpt-4o-mini"

# Django Settings
# Read from environment variables for production, fallback to defaults for development
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-rankcatalyst-dev-key-change-in-production-2024")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# ALLOWED_HOSTS - Handle both comma-separated string and list
allowed_hosts_str = os.getenv("ALLOWED_HOSTS", "")
if allowed_hosts_str:
    # Split by comma and strip whitespace
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_str.split(",") if host.strip()]
else:
    # Default for development
    ALLOWED_HOSTS = ["localhost", "127.0.0.1","rankcatalystetet.onrender.com"]

# Site Info for OpenRouter
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")  # Frontend URL
SITE_NAME = os.getenv("SITE_NAME", "RankCatalyst")

# Database
# Use PostgreSQL in production (via DATABASE_URL), SQLite in development
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    # Parse DATABASE_URL for production (format: postgresql://user:pass@host:port/dbname)
    import re
    db_match = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', DATABASE_URL)
    if db_match:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': db_match.group(5),
                'USER': db_match.group(1),
                'PASSWORD': db_match.group(2),
                'HOST': db_match.group(3),
                'PORT': db_match.group(4),
            }
        }
    else:
        # Fallback to SQLite if DATABASE_URL parsing fails
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
else:
    # Development: Use SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# CORS Settings
# In production, use specific origins; in dev, allow all
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", str(DEBUG)).lower() == "true"
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

