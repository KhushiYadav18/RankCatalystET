"""
Test script to verify OpenRouter API key is working
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add backend to path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Load .env file
env_path = BASE_DIR / '.env'
if env_path.exists():
    try:
        # Try to load with explicit UTF-8 encoding
        load_dotenv(env_path, encoding='utf-8')
        print(f"✓ Loaded .env file from {env_path}")
    except UnicodeDecodeError:
        print(f"✗ ERROR: .env file has encoding issues!")
        print("  Please recreate the file with UTF-8 encoding.")
        print("  Run this command to fix it:")
        print(f'  python -c "open(\'{env_path}\', \'w\', encoding=\'utf-8\').write(\'OPENROUTER_API_KEY=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\\n\')"')
        sys.exit(1)
else:
    print(f"✗ Warning: .env file not found at {env_path}")
    print("  Trying to read from config.py directly...")

# Get API key
api_key = os.getenv("OPENROUTER_API_KEY", "")
if not api_key:
    print("\n✗ ERROR: OPENROUTER_API_KEY not found in environment variables!")
    print("  Please make sure .env file exists in backend/ directory with:")
    print("  OPENROUTER_API_KEY=your-key-here")
    sys.exit(1)

print(f"\n✓ API Key found: {api_key[:20]}...{api_key[-10:]}")
print(f"  Key length: {len(api_key)} characters")

# Test the API key
try:
    from openai import OpenAI
    
    print("\n🔍 Testing API key with OpenRouter...")
    
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    
    # Make a simple test call
    response = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "RankCatalyst",
        },
        model="openai/gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": "Say 'API key is working!' if you can read this."
            }
        ],
        max_tokens=20
    )
    
    result = response.choices[0].message.content
    print(f"\n✅ SUCCESS! API key is working!")
    print(f"   Response: {result}")
    print(f"   Model: {response.model}")
    print(f"   Usage: {response.usage.total_tokens} tokens")
    
except Exception as e:
    print(f"\n❌ ERROR: API key test failed!")
    print(f"   Error type: {type(e).__name__}")
    print(f"   Error message: {str(e)}")
    
    if "401" in str(e) or "Unauthorized" in str(e):
        print("\n   ⚠️  This usually means:")
        print("   - The API key is invalid or expired")
        print("   - The API key format is incorrect")
    elif "429" in str(e):
        print("\n   ⚠️  This usually means:")
        print("   - Rate limit exceeded")
        print("   - Check your OpenRouter account limits")
    else:
        print("\n   ⚠️  Check your internet connection and OpenRouter service status")
    
    sys.exit(1)

print("\n✓ API key test completed successfully!")

