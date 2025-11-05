"""
WSGI config for RankCatalyst project.
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Get WSGI application
application = get_wsgi_application()

# Note: Migrations should be run via:
# 1. Build command (recommended)
# 2. Setup endpoint: /api/quizzes/setup/
# Do NOT run migrations in wsgi.py as it causes 502 errors

