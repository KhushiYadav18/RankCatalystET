# 🔧 Fix 400 Bad Request Error on Render

## Problem
You're seeing `400 Bad Request` errors when accessing your Render service. This is because Django's `ALLOWED_HOSTS` doesn't include your Render domain.

## Solution: Set ALLOWED_HOSTS Environment Variable

### Step 1: Add ALLOWED_HOSTS

1. Go to **Render Dashboard** → Your service → **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Set:
   - **Key**: `ALLOWED_HOSTS`
   - **Value**: `rankcatalystet.onrender.com`
4. Click **"Save Changes"**
5. Wait for redeploy (1-2 minutes)

### Step 2: Verify It Works

After redeploy, try accessing:
- `https://rankcatalystet.onrender.com/api/` - Should show API root or 404 (not 400)
- `https://rankcatalystet.onrender.com/api/quizzes/chapters/` - Should show JSON or auth error

### Alternative: Add Multiple Hosts

If you have multiple domains, separate with commas:
```
rankcatalystet.onrender.com,www.rankcatalyst.com,rankcatalyst.com
```

### Complete Environment Variables List

For reference, here are all recommended environment variables:

1. **ALLOWED_HOSTS** = `rankcatalystet.onrender.com` ⚠️ REQUIRED
2. **SECRET_KEY** = `your-secret-key-here` (generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
3. **DEBUG** = `False` (for production)
4. **DATABASE_URL** = (auto-set by Render PostgreSQL)
5. **OPENROUTER_API_KEY** = `your-openrouter-key`
6. **SITE_URL** = `https://your-frontend-url.vercel.app`
7. **SETUP_SECRET** = `your-secret-password` (for setup endpoint)

### Still Getting 400?

1. Check that `ALLOWED_HOSTS` is set correctly (no extra spaces)
2. Verify the value matches your service URL exactly
3. Check Render logs for Django errors
4. Make sure you saved changes and waited for redeploy

