#!/bin/bash
# Build script for Render deployment
set -o errexit

echo "Building RankCatalyst backend..."

# Install dependencies
pip install -r requirements.txt

# Run migrations during build (if enabled)
# Note: This runs during build, which is safer than at runtime
if [ "$AUTO_MIGRATE" = "true" ]; then
    echo "Running migrations during build..."
    python manage.py migrate --noinput || echo "Migration error (may need to run manually)"
fi

# Collect static files
python manage.py collectstatic --noinput

echo "Build completed successfully!"

