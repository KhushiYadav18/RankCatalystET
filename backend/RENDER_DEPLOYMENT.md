# Render Deployment Guide for RankCatalyst Backend

This guide will help you deploy the RankCatalyst backend to Render using SQLite database.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your OpenRouter API key
3. Your frontend URL (where your frontend will be hosted)

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub, GitLab, or Bitbucket.

## Step 2: Create a Web Service on Render

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your repository
4. Select the repository and branch

## Step 3: Configure Build Settings

**Build Command:**
```bash
cd backend && pip install -r requirements.txt
```

**Start Command:**
```bash
cd backend && python manage.py migrate && python manage.py load_questions && gunicorn config.wsgi:application
```

## Step 4: Set Environment Variables

In the Render dashboard, go to "Environment" tab and add these variables:

### Required Variables:

```
OPENROUTER_API_KEY=your-openrouter-api-key-here
SECRET_KEY=your-generated-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
SITE_URL=https://your-frontend-url.com
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

### Optional Variables:

```
SITE_NAME=RankCatalyst
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-4o-mini
```

## Step 5: Generate Secret Key

Generate a secure secret key using Django:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and use it as your `SECRET_KEY` in Render.

## Step 6: Update Requirements for Production

You'll need to add `gunicorn` to your `requirements.txt` for production deployment. It should include:

```
Django>=5.0,<6.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.3.0
django-cors-headers>=4.3.0
python-dotenv>=1.0.0
openai>=1.0.0
gunicorn>=21.2.0
```

## Step 7: Deploy

1. Click "Create Web Service"
2. Render will build and deploy your application
3. Your backend will be available at `https://your-app-name.onrender.com`

## Important Notes

### SQLite on Render

- SQLite works on Render but has limitations:
  - File-based storage means data is stored in the filesystem
  - If you use auto-deploy from Git, the database file will be reset on each deployment
  - For production with persistent data, consider using Render's PostgreSQL service (free tier available)

### Environment Variables Format

- `ALLOWED_HOSTS`: Comma-separated list (e.g., `localhost,127.0.0.1,app.onrender.com`)
- `CORS_ALLOWED_ORIGINS`: Comma-separated list (e.g., `http://localhost:3000,https://your-frontend.com`)
- Boolean values: Use `True`/`False` or `1`/`0` (case-insensitive)

### Frontend Configuration

Update your frontend's API URL to point to your Render backend URL:
```
https://your-app-name.onrender.com/api/
```

## Troubleshooting

1. **Build fails**: Check that all dependencies are in `requirements.txt`
2. **500 errors**: Check Render logs, ensure all environment variables are set
3. **CORS errors**: Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
4. **Database errors**: Run migrations manually if needed using Render's shell

## Manual Migration (if needed)

If migrations don't run automatically, you can use Render's shell:

1. Go to your service → "Shell"
2. Run:
```bash
cd backend
python manage.py migrate
python manage.py load_questions
```

