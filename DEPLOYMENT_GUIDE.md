# 🚀 Complete Deployment Guide - RankCatalyst

Deploy RankCatalyst to **Render** (Backend) and **Vercel** (Frontend) - **100% FREE**

---

## 📋 Prerequisites Checklist

- [ ] GitHub account
- [ ] Render account (https://render.com - sign up with GitHub)
- [ ] Vercel account (https://vercel.com - sign up with GitHub)
- [ ] OpenRouter API key (already have it)

---

## Step 1: Prepare Code for GitHub

### 1.1 Ensure `.gitignore` is correct

Check that `.gitignore` exists (already created) and includes:
- `.env` files
- `node_modules/`
- `db.sqlite3`
- `.venv/`

### 1.2 Initialize Git Repository (if not done)

```bash
# Navigate to project root
cd "C:\Users\Khushi Yadav\OneDrive\Desktop\NEW ET"

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - RankCatalyst ready for deployment"
```

### 1.3 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `rankcatalyst`
3. Description: "ITS-aware JEE Chemistry Quiz Platform"
4. Choose **Public** (or Private)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### 1.4 Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rankcatalyst.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Sign Up / Login to Render

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### 2.2 Create PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `rankcatalyst-db`
3. Database: `rankcatalyst`
4. User: `rankcatalyst_user`
5. Region: Choose closest (e.g., `Oregon (US West)`)
6. Plan: **Free**
7. Click **"Create Database"**
8. **Wait 2-3 minutes** for database to be created
9. Copy the **Internal Database URL** (you'll need this later)

postgresql://rankcatalyst_user:WRKHR4RhIte446PeJm6yFjFxQqa6azst@dpg-d45mrhf5r7bs73amareg-a/rankcatalyst

### 2.3 Create Web Service (Backend)

1. Click **"New +"** → **"Web Service"**
2. Connect your `rankcatalyst` repository
3. Select the repository

### 2.4 Configure Backend Service

**Basic Settings:**
- **Name:** `rankcatalyst-backend`
- **Region:** Same as database
- **Branch:** `main`
- **Root Directory:** `backend`
- **Environment:** `Python 3`
- **Build Command:**
  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --noinput
  ```
- **Start Command:**
  ```bash
  gunicorn config.wsgi:application
  ```

### 2.5 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
PYTHON_VERSION=3.11.0
```

Then click **"Environment"** tab and add:

```
OPENROUTER_API_KEY=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
SECRET_KEY=<generate-a-secret-key>
DEBUG=False
ALLOWED_HOSTS=rankcatalyst-backend.onrender.com
DJANGO_SETTINGS_MODULE=config.settings
DATABASE_URL=<paste-internal-database-url-from-step-2.2>
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://rankcatalyst.vercel.app,https://rankcatalyst-git-main.vercel.app
SITE_URL=https://rankcatalyst.vercel.app
SITE_NAME=RankCatalyst
```

**To generate SECRET_KEY, run:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.6 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for build (5-10 minutes)
3. Your backend URL will be: `https://rankcatalyst-backend.onrender.com`

### 2.7 Run Migrations & Setup

After deployment completes:

1. Go to **Render Dashboard** → Your service → **"Shell"** tab
2. Run these commands:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py load_questions
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select `rankcatalyst` repository
3. Click **"Import"**

### 3.3 Configure Frontend Project

**Framework Preset:** Next.js (auto-detected)

**Project Settings:**
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add:

**Variable Name:** `NEXT_PUBLIC_API_BASE_URL`
**Value:** `https://rankcatalyst-backend.onrender.com/api`

**Important:** Replace `rankcatalyst-backend` with your actual Render service name!

### 3.5 Deploy Frontend

1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Your frontend URL will be: `https://rankcatalyst.vercel.app`

---

## Step 4: Update CORS Settings

After getting your Vercel URL:

1. Go to **Render Dashboard** → Your backend service → **"Environment"**
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://rankcatalyst.vercel.app,https://rankcatalyst-git-main.vercel.app,https://rankcatalyst-git-main-YOUR_USERNAME.vercel.app
   ```
3. Click **"Save Changes"**
4. Render will automatically redeploy

---

## Step 5: Test Deployment

### 5.1 Test Backend

Visit: `https://rankcatalyst-backend.onrender.com/api/quizzes/chapters/`

Should return: `{"detail":"Authentication credentials were not provided."}` (This is correct - means API is working!)

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Try to sign up
3. Try to log in
4. Start a quiz

---

## 🎯 Quick Reference

### Backend URLs:
- **Render Service:** `https://rankcatalyst-backend.onrender.com`
- **API Base:** `https://rankcatalyst-backend.onrender.com/api`

### Frontend URLs:
- **Vercel:** `https://rankcatalyst.vercel.app`

### Important Environment Variables:

**Backend (Render):**
- `OPENROUTER_API_KEY`
- `SECRET_KEY`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGINS`

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_BASE_URL`

---

## 🔧 Troubleshooting

### Backend Issues

**Build fails:**
- Check `requirements.txt` has all dependencies
- Ensure Python version matches (3.11.0)
- Check build logs in Render dashboard

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Ensure database is created and running
- Check database credentials

**Static files not loading:**
- Ensure `whitenoise` is in requirements.txt
- Check `collectstatic` runs in build command

### Frontend Issues

**API connection errors:**
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check CORS settings on backend
- Open browser console for errors

**Build fails:**
- Check all dependencies in `package.json`
- Fix TypeScript errors
- Check build logs in Vercel dashboard

---

## 📝 Notes

1. **Free Tier Limits:**
   - Render: Services sleep after 15 min inactivity
   - Vercel: 100GB bandwidth/month
   - Both have generous free tiers!

2. **Custom Domains:**
   - Both Render and Vercel support custom domains
   - Configure in respective dashboards

3. **Auto-Deploy:**
   - Both platforms auto-deploy on git push
   - No manual deployment needed!

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] PostgreSQL database created on Render
- [ ] Backend service created on Render
- [ ] Environment variables set on Render
- [ ] Migrations run
- [ ] Questions loaded
- [ ] Vercel account created
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on Vercel
- [ ] CORS updated with Vercel URLs
- [ ] Tested signup/login
- [ ] Tested quiz functionality

---

## 🎉 You're Done!

Your RankCatalyst app is now live! 🚀

**Backend:** https://rankcatalyst-backend.onrender.com
**Frontend:** https://rankcatalyst.vercel.app

