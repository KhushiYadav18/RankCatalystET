# 🔧 Quick Fix for 502 Error

## Problem
Your app is showing 502 errors because migrations are trying to run in `wsgi.py` before Django is ready.

## Solution: Remove AUTO_MIGRATE from Environment Variables

### Step 1: Remove AUTO_MIGRATE

1. Go to **Render Dashboard** → Your service → **"Environment"** tab
2. Find `AUTO_MIGRATE` variable
3. Click **Delete** or remove it
4. Click **"Save Changes"**
5. Render will redeploy (this should fix the 502 error)

### Step 2: Use Build Command Instead (Recommended)

1. Go to **"Settings"** tab
2. Find **"Build Command"**
3. Update to:
   ```bash
   pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput
   ```
4. Save changes
5. Render will redeploy with migrations running during build

### Step 3: Use Setup Endpoint for Full Setup

After migrations run during build, use the setup endpoint to:
- Create superuser
- Load questions

1. Add `SETUP_SECRET` environment variable
2. Call the setup endpoint (see DEPLOYMENT_GUIDE.md)

---

## Alternative: Just Use Setup Endpoint

**Simplest approach - use the setup endpoint for everything:**

1. **Remove `AUTO_MIGRATE`** from environment variables
2. **Add `SETUP_SECRET`** environment variable
3. **Wait for redeploy** (502 should be fixed)
4. **Call setup endpoint** once to do everything:
   - Migrations
   - Superuser creation
   - Question loading

See DEPLOYMENT_GUIDE.md Method 2 for setup endpoint instructions.

