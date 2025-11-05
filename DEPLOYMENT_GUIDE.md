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

**During Service Creation:**

1. Scroll down to the **"Environment Variables"** section (it's on the same page as Build Settings)
2. Click **"Add Environment Variable"** button
3. Add each variable one by one:

**Add these environment variables:**

1. **PYTHON_VERSION**
   - Key: `PYTHON_VERSION`
   - Value: `3.11.0`

2. **OPENROUTER_API_KEY**
   - Key: `OPENROUTER_API_KEY`
   - Value: `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`

3. **SECRET_KEY**
   - Key: `SECRET_KEY`
   - Value: `iceo!!-1+x03nskr(*uic%1xpf*&u_-+oa#vfnh(k*7x^ai&9%`
   - (Or generate your own - see below)

4. **DEBUG**
   - Key: `DEBUG`
   - Value: `False`

5. **ALLOWED_HOSTS** ⚠️ **CRITICAL - Fixes 400 Errors!**
   - Key: `ALLOWED_HOSTS`
   - Value: `rankcatalystet.onrender.com` (your exact Render service URL, no https://)
   - **This MUST be set correctly or you'll get 400 Bad Request errors!**
   - Example: If your URL is `https://rankcatalystet.onrender.com`, use `rankcatalystet.onrender.com`

6. **DJANGO_SETTINGS_MODULE**
   - Key: `DJANGO_SETTINGS_MODULE`
   - Value: `config.settings`

7. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `postgresql://rankcatalyst_user:WRKHR4RhIte446PeJm6yFjFxQqa6azst@dpg-d45mrhf5r7bs73amareg-a/rankcatalyst`
   - (Use the Internal Database URL from step 2.2)

8. **CORS_ALLOW_ALL_ORIGINS**
   - Key: `CORS_ALLOW_ALL_ORIGINS`
   - Value: `False`

9. **CORS_ALLOWED_ORIGINS**
   - Key: `CORS_ALLOWED_ORIGINS`
   - Value: `https://rankcatalyst.vercel.app,https://rankcatalyst-git-main.vercel.app`
   - (Update this after you get your Vercel URL)

10. **SITE_URL**
    - Key: `SITE_URL`
    - Value: `https://rankcatalyst.vercel.app`
    - (Update after you get your Vercel URL)

11. **SITE_NAME**
    - Key: `SITE_NAME`
    - Value: `RankCatalyst`

**To generate SECRET_KEY, run:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Alternative: Add Environment Variables After Creation**

If you don't see the Environment Variables section during creation:

1. Complete the service creation first
2. After the service is created, go to your service dashboard
3. Click on **"Environment"** tab (in the left sidebar or top navigation)
4. Click **"Add Environment Variable"** button
5. **⚠️ FIRST: Add ALLOWED_HOSTS** (required to fix 400 errors):
   - Key: `ALLOWED_HOSTS`
   - Value: `rankcatalystet.onrender.com` (your service URL)
6. Add other variables one by one
7. Click **"Save Changes"** - Render will automatically redeploy

### 2.6 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for build (5-10 minutes)
3. Your backend URL will be: `https://rankcatalyst-backend.onrender.com`

### 2.7 Run Migrations & Setup (FREE - No Shell Required!)

**Option 1: Update Build Command (Recommended - No Environment Variables Needed)**

1. Go to **Render Dashboard** → Your service → **"Settings"** tab
2. Find **"Build Command"** and update to:
   ```bash
   pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
   ```
3. Click **"Save Changes"** - Render will redeploy
4. Migrations will run automatically during build!
5. **After build completes**, use Option 2 to create superuser and load questions

**Option 2: Setup via HTTP Endpoint (Recommended)**

1. Go to **Render Dashboard** → Your service → **"Environment"** tab
2. Add this environment variable:
   - Key: `SETUP_SECRET`
   - Value: `your-secret-password-here` (choose a strong password)
3. Save changes and wait for redeploy
4. Visit this URL in your browser (replace with your values):
   ```
   https://rankcatalystet.onrender.com/api/quizzes/setup/
   ```
5. Use a tool like Postman or curl to send POST request:
   ```bash
   curl -X POST https://rankcatalystet.onrender.com/api/quizzes/setup/ \
     -H "Content-Type: application/json" \
     -d '{"secret": "your-secret-password-here", "admin_email": "admin@rankcatalyst.com", "admin_password": "admin123"}'
   ```
   Or use this online tool: https://reqbin.com/curl
   
   **For Browser (use browser console):**
   ```javascript
   fetch('https://rankcatalystet.onrender.com/api/quizzes/setup/', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({
       secret: 'your-secret-password-here',
       admin_email: 'admin@rankcatalyst.com',
       admin_password: 'admin123'
     })
   }).then(r => r.json()).then(console.log)
   ```

**Option 3: Use Setup Endpoint Only (Simplest)**

Skip auto-migration and just use the setup endpoint (Method 2) which handles everything:
- Migrations
- Superuser creation  
- Question loading

All in one call!

**After Setup:**
- Remove `SETUP_SECRET` or `AUTO_MIGRATE` from environment variables for security
- Or keep `AUTO_MIGRATE=true` if you want migrations to run on every deploy

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

