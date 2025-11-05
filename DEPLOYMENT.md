# Deployment Guide - RankCatalyst

This guide covers deploying RankCatalyst to:
- **Backend (Django)**: Render (Free Tier)
- **Frontend (Next.js)**: Vercel (Free Tier)

## Prerequisites

1. GitHub account
2. Render account (sign up at https://render.com)
3. Vercel account (sign up at https://vercel.com)

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Create `.gitignore` files

**Root `.gitignore`:**
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
ENV/
db.sqlite3
*.db

# Django
*.log
local_settings.py

# Environment variables
.env
.env.local
.env.*.local

# Node
node_modules/
.next/
out/
build/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Deployment
.render/
.vercel/
```

**Backend `.gitignore` (if separate):**
```
*.pyc
__pycache__/
db.sqlite3
.env
.venv/
venv/
```

**Frontend `.gitignore` (if separate):**
```
node_modules/
.next/
out/
.env.local
.env*.local
```

### 1.2 Create `.env.example` files

**Backend `.env.example`:**
```
OPENROUTER_API_KEY=your-openrouter-api-key-here
SECRET_KEY=your-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
```

**Frontend `.env.example`:**
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
```

### 1.3 Update config files for production

The backend `config.py` should read from environment variables in production.

---

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - RankCatalyst"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `rankcatalyst`
3. Don't initialize with README (if you already have code)

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/rankcatalyst.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Connect your GitHub account

### 3.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your `rankcatalyst` repository
3. Select the repository

### 3.3 Configure Service Settings

**Name:** `rankcatalyst-backend`

**Region:** Choose closest to you (e.g., `Oregon (US West)`)

**Branch:** `main`

**Root Directory:** `backend`

**Environment:** `Python 3`

**Build Command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**Start Command:**
```bash
gunicorn config.wsgi:application
```

### 3.4 Add Environment Variables

Click **"Environment"** tab and add:

```
OPENROUTER_API_KEY=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
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False
ALLOWED_HOSTS=rankcatalyst-backend.onrender.com
DJANGO_SETTINGS_MODULE=config.settings
PYTHON_VERSION=3.11.0
```

**Important:** 
- Generate a new `SECRET_KEY` for production (use: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- Update `ALLOWED_HOSTS` with your actual Render URL

### 3.5 Update Database Settings

For production, you'll need PostgreSQL (free tier available on Render):

1. Go to **"New +"** → **"PostgreSQL"**
2. Name: `rankcatalyst-db`
3. Select **Free** plan
4. Copy the **Internal Database URL**

Add to environment variables:
```
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### 3.6 Create `render.yaml` (Optional)

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: rankcatalyst-backend
    env: python
    buildCommand: pip install -r requirements.txt && python manage.py collectstatic --noinput
    startCommand: gunicorn config.wsgi:application
    envVars:
      - key: OPENROUTER_API_KEY
        sync: false
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: ALLOWED_HOSTS
        value: rankcatalyst-backend.onrender.com
```

### 3.7 Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Your backend will be available at: `https://rankcatalyst-backend.onrender.com`

### 3.8 Run Migrations

After first deployment, run migrations:

1. Go to **"Shell"** tab in Render dashboard
2. Run:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py load_questions
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Connect your GitHub account

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your `rankcatalyst` repository
3. Select the repository

### 4.3 Configure Project

**Framework Preset:** Next.js

**Root Directory:** `frontend`

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

### 4.4 Add Environment Variables

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_BASE_URL=https://rankcatalyst-backend.onrender.com/api
```

### 4.5 Deploy

1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Your frontend will be available at: `https://rankcatalyst.vercel.app`

---

## Step 5: Update CORS Settings

After getting your Vercel URL, update backend CORS:

1. Go to Render dashboard → Your service → **Environment**
2. Add/Update:
```
CORS_ALLOWED_ORIGINS=https://rankcatalyst.vercel.app,https://rankcatalyst-git-main.vercel.app
```

Or update in `backend/config.py` to read from env:
```python
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
```

---

## Step 6: Update Frontend API URL

Update `frontend/config.ts` or create `frontend/.env.production`:
```
NEXT_PUBLIC_API_BASE_URL=https://rankcatalyst-backend.onrender.com/api
```

---

## Step 7: Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Database migrations run
- [ ] Questions loaded (`load_questions`)
- [ ] Superuser created
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] API key working
- [ ] Frontend can connect to backend

---

## Troubleshooting

### Backend Issues

**Build fails:**
- Check `requirements.txt` has all dependencies
- Ensure `gunicorn` is in requirements.txt
- Check Python version matches

**Database errors:**
- Run migrations: `python manage.py migrate`
- Check DATABASE_URL is correct

**Static files:**
- Add `whitenoise` to requirements.txt
- Update settings.py for static files

### Frontend Issues

**API connection errors:**
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify CORS is configured on backend
- Check browser console for errors

**Build fails:**
- Check all dependencies in `package.json`
- Ensure TypeScript errors are fixed

---

## Free Tier Limits

### Render (Free Tier)
- 750 hours/month
- Services sleep after 15 minutes of inactivity
- PostgreSQL database (free tier available)
- Custom domain support

### Vercel (Free Tier)
- Unlimited deployments
- 100GB bandwidth/month
- Custom domain support
- Automatic HTTPS

---

## Next Steps

1. Set up custom domains (optional)
2. Configure automatic deployments
3. Set up monitoring/logging
4. Add CI/CD workflows

