# Render Deployment Checklist

## What You Need to Add to Your .env File (or Render Environment Variables)

Your current `.env` file only has `OPENROUTER_API_KEY`. For deployment, you need to add:

### Minimum Required for Render:

1. **SECRET_KEY** (Required)
   - Generate a secure key: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
   - Add to Render environment variables

2. **DEBUG** (Required)
   - Set to: `False`
   - Add to Render environment variables

3. **ALLOWED_HOSTS** (Required)
   - Set to: `your-app-name.onrender.com` (replace with your actual Render app name)
   - Add to Render environment variables

4. **SITE_URL** (Required)
   - Set to: `https://your-frontend-url.com` (your frontend URL)
   - Add to Render environment variables

5. **CORS_ALLOW_ALL_ORIGINS** (Required)
   - Set to: `False`
   - Add to Render environment variables

6. **CORS_ALLOWED_ORIGINS** (Required)
   - Set to: `https://your-frontend-url.com` (your frontend URL)
   - Add to Render environment variables

### Example Render Environment Variables:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
SECRET_KEY=your-generated-secret-key-here
DEBUG=False
ALLOWED_HOSTS=rankcatalyst-backend.onrender.com
SITE_URL=https://your-frontend-url.com
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

## Render Configuration Steps

1. **Build Command:**
   ```
   cd backend && pip install -r requirements.txt
   ```

2. **Start Command:**
   ```
   cd backend && python manage.py migrate && python manage.py load_questions && gunicorn config.wsgi:application
   ```

3. **Environment Variables:**
   - Add all the variables listed above in Render dashboard → Environment tab

## What Changed

✅ **config.py** - Now reads all settings from environment variables
✅ **requirements.txt** - Added `gunicorn` for production server
✅ **Documentation** - Created deployment guides

## Current Setup

Your system is now **centralized** - all configuration comes from environment variables:
- Development: Uses `.env` file (if exists)
- Production (Render): Uses environment variables set in Render dashboard
- Defaults: Safe defaults for development if nothing is set

## Next Steps

1. Generate your `SECRET_KEY` using the command above
2. Set all environment variables in Render dashboard
3. Deploy your backend
4. Update your frontend to point to the Render backend URL

See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.

