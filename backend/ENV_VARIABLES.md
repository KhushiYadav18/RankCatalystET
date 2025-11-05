# Environment Variables Reference

This document lists all environment variables used by the RankCatalyst backend.

## Required Variables

### `OPENROUTER_API_KEY`
- **Description**: Your OpenRouter API key for LLM features
- **Example**: `sk-or-v1-xxxxxxxxxxxxx`
- **Required**: Yes

### `SECRET_KEY`
- **Description**: Django secret key for cryptographic signing
- **Example**: Generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- **Required**: Yes (for production)
- **Default**: Development key (insecure, change for production)

## Production Variables (Required for Render)

### `DEBUG`
- **Description**: Enable/disable debug mode
- **Values**: `True`, `False`, `1`, `0`, `yes`, `no` (case-insensitive)
- **Default**: `False`
- **Production**: Must be `False`

### `ALLOWED_HOSTS`
- **Description**: Comma-separated list of allowed hostnames
- **Example**: `your-app.onrender.com,localhost,127.0.0.1`
- **Default**: `localhost,127.0.0.1`
- **Production**: Must include your Render domain

### `SITE_URL`
- **Description**: Frontend URL for OpenRouter API
- **Example**: `https://your-frontend.com`
- **Default**: `http://localhost:3000`
- **Production**: Must be your production frontend URL

### `CORS_ALLOW_ALL_ORIGINS`
- **Description**: Allow all origins (development only)
- **Values**: `True`, `False`, `1`, `0`, `yes`, `no` (case-insensitive)
- **Default**: `False`
- **Production**: Must be `False`

### `CORS_ALLOWED_ORIGINS`
- **Description**: Comma-separated list of allowed CORS origins
- **Example**: `https://your-frontend.com,https://www.your-frontend.com`
- **Default**: `http://localhost:3000,http://127.0.0.1:3000`
- **Production**: Must include your production frontend URL

## Optional Variables

### `SITE_NAME`
- **Description**: Site name for OpenRouter API
- **Default**: `RankCatalyst`

### `OPENROUTER_BASE_URL`
- **Description**: OpenRouter API base URL
- **Default**: `https://openrouter.ai/api/v1`

### `OPENROUTER_MODEL`
- **Description**: OpenRouter model to use
- **Default**: `openai/gpt-4o-mini`

## Example .env File (Development)

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
SITE_URL=http://localhost:3000
SITE_NAME=RankCatalyst
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Example Environment Variables for Render

In Render dashboard, set these in the Environment tab:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
SECRET_KEY=your-generated-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
SITE_URL=https://your-frontend-url.com
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
SITE_NAME=RankCatalyst
```

## Notes

- All boolean values are case-insensitive
- Comma-separated values should not have spaces around commas (or they will be trimmed)
- Environment variables take precedence over defaults
- If `.env` file doesn't exist, the system will use environment variables directly (useful for Render)

