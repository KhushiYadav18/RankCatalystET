#!/bin/bash
# Build script for Render deployment
set -o errexit

echo "Building RankCatalyst backend..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

echo "Build completed successfully!"

