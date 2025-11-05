"""
Startup script to run migrations automatically on Render
This runs when the app starts
"""
import os
import sys
from django.core.management import call_command
from django.core.wsgi import get_wsgi_application

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_wsgi_application()

# Run migrations on startup (only if AUTO_MIGRATE is set)
if os.getenv('AUTO_MIGRATE', 'False').lower() == 'true':
    try:
        print("Running migrations on startup...")
        call_command('migrate', verbosity=0)
        print("✓ Migrations completed")
    except Exception as e:
        print(f"⚠️ Migration error: {e}")

