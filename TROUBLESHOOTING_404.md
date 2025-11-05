# 🔧 Troubleshooting 404 Error on OPTIONS Request

## Problem
You're getting `404 Not Found` on OPTIONS request to `/api/auth/register/`. This is a CORS preflight request that should be handled automatically.

## Possible Causes

### 1. Wrong Service URL
The error shows `rankcatalyst.onrender.com` but we've been using `rankcatalystet.onrender.com`. 

**Check:**
- Is your service URL correct?
- Did you set `ALLOWED_HOSTS` to match your actual service URL?

### 2. CORS Middleware Not Working
The CORS middleware should handle OPTIONS automatically, but sometimes it doesn't.

**Solution Added:**
I've added explicit CORS method and header settings in `backend/config/settings.py`. After redeploy, this should fix it.

### 3. Verify Service is Running
1. Go to Render Dashboard
2. Check your service status (should be "Live")
3. Check the service URL matches what you're using

### 4. Test the Endpoint Directly

**Test with curl:**
```bash
# Test OPTIONS (CORS preflight)
curl -X OPTIONS https://rankcatalystet.onrender.com/api/auth/register/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test POST (actual request)
curl -X POST https://rankcatalystet.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"test@test.com","password":"test1234","passwordConfirm":"test1234"}' \
  -v
```

### 5. Check Environment Variables

Make sure these are set on Render:
- `ALLOWED_HOSTS` = `rankcatalystet.onrender.com` (your actual service URL)
- `CORS_ALLOW_ALL_ORIGINS` = `True` (for testing, or set specific origins)
- `CORS_ALLOWED_ORIGINS` = `https://your-frontend-url.vercel.app` (if using specific origins)

### 6. Verify URL Routing

The URL should be:
- `/api/auth/register/` (with trailing slash)

Make sure your frontend is calling:
```typescript
// Correct
POST /api/auth/register/

// Wrong
POST /api/auth/register  // No trailing slash
```

## Quick Fix Checklist

1. ✅ Verify service URL matches `ALLOWED_HOSTS`
2. ✅ Check CORS settings in environment variables
3. ✅ Ensure trailing slash in URL (`/api/auth/register/`)
4. ✅ Redeploy after making changes
5. ✅ Test with curl/browser console first

## Still Not Working?

1. Check Render logs for Django errors
2. Verify the service is actually deployed (not just building)
3. Try accessing `/api/auth/login/` to see if it's a routing issue
4. Check if `django-cors-headers` is in `requirements.txt`

