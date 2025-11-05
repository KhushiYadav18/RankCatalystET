"""
Script to fix .env file encoding issues
"""
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
env_path = BASE_DIR / '.env'

# API key value
api_key = "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"

# Write with proper UTF-8 encoding
with open(env_path, 'w', encoding='utf-8') as f:
    f.write(f"OPENROUTER_API_KEY={api_key}\n")

print(f"✓ Created .env file at {env_path} with UTF-8 encoding")
print(f"  API Key: {api_key[:20]}...{api_key[-10:]}")

