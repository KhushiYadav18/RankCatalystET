# 🆓 Free Alternatives to Render Shell

Since Render Shell is not available on free tier, here are **3 FREE alternatives** to run migrations and setup:

---

## ✅ Method 1: Auto-Migrate on Startup (EASIEST)

### Steps:

1. **Go to Render Dashboard** → Your service → **"Environment"** tab
2. **Add Environment Variable:**
   - Key: `AUTO_MIGRATE`
   - Value: `true`
3. **Save Changes** - Render will automatically redeploy
4. **Check Logs** - After redeploy, check the "Logs" tab. You should see:
   ```
   Running migrations on startup...
   ✓ Migrations completed
   ```

### What this does:
- ✅ Runs migrations automatically when app starts
- ✅ No manual action needed
- ⚠️ Can't create superuser or load questions (but migrations work!)

### To create superuser and load questions:
- Use Method 2 (HTTP endpoint) after migrations are done

---

## ✅ Method 2: Setup via HTTP Endpoint (RECOMMENDED)

### Step 1: Set Setup Secret

1. Go to **Render Dashboard** → Your service → **"Environment"** tab
2. Add:
   - Key: `SETUP_SECRET`
   - Value: `your-strong-password-here` (choose a secure password)
3. Save changes

### Step 2: Call Setup Endpoint

**Option A: Using Browser Console**

1. Visit your backend: `https://rankcatalystet.onrender.com`
2. Open browser console (F12)
3. Paste this code (replace `your-secret` with your SETUP_SECRET):

```javascript
fetch('https://rankcatalystet.onrender.com/api/quizzes/setup/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    secret: 'your-secret',
    admin_email: 'admin@rankcatalyst.com',
    admin_password: 'admin123'
  })
})
.then(r => r.json())
.then(data => console.log('Setup Result:', data))
.catch(err => console.error('Error:', err));
```

**Option B: Using Online Tool**

1. Go to https://reqbin.com/curl
2. Set method to **POST**
3. URL: `https://rankcatalystet.onrender.com/api/quizzes/setup/`
4. Headers: `Content-Type: application/json`
5. Body:
```json
{
  "secret": "your-secret",
  "admin_email": "admin@rankcatalyst.com",
  "admin_password": "admin123"
}
```
6. Click **Send**

**Option C: Using curl (if you have it)**

```bash
curl -X POST https://rankcatalystet.onrender.com/api/quizzes/setup/ \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret", "admin_email": "admin@rankcatalyst.com", "admin_password": "admin123"}'
```

### What this does:
- ✅ Runs migrations
- ✅ Creates superuser (if none exists)
- ✅ Loads questions
- ✅ Returns JSON response with results

### Response:
```json
{
  "status": "completed",
  "results": {
    "migrations": "success",
    "superuser": "success: created admin@rankcatalyst.com",
    "questions": "success"
  }
}
```

---

## ✅ Method 3: Update Build Command

### Steps:

1. Go to **Render Dashboard** → Your service → **"Settings"** tab
2. Find **"Build Command"**
3. Update to:
   ```bash
   pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
   ```
4. Save changes - Render will redeploy

### What this does:
- ✅ Runs migrations during build
- ⚠️ Can't create superuser (interactive)
- ⚠️ Can't load questions (needs to be done separately)

### To load questions:
- Use Method 2 (HTTP endpoint) after build

---

## 🎯 Recommended Approach

**Use Method 1 + Method 2 together:**

1. **Set `AUTO_MIGRATE=true`** → Migrations run automatically
2. **Set `SETUP_SECRET`** → Call setup endpoint once to:
   - Create superuser
   - Load questions
3. **After setup is done**, remove `SETUP_SECRET` for security

---

## 🔒 Security Notes

- **SETUP_SECRET**: Choose a strong password
- **Remove SETUP_SECRET** after setup is complete (for security)
- **AUTO_MIGRATE**: Safe to keep enabled (only runs migrations)

---

## 📝 Quick Checklist

- [ ] Set `AUTO_MIGRATE=true` in Render
- [ ] Set `SETUP_SECRET=your-password` in Render
- [ ] Wait for redeploy
- [ ] Call setup endpoint via browser/curl
- [ ] Verify migrations ran (check logs)
- [ ] Verify superuser created (try login)
- [ ] Verify questions loaded (check chapters endpoint)
- [ ] Remove `SETUP_SECRET` after setup (optional, for security)

---

## 🆘 Troubleshooting

**Setup endpoint returns 403:**
- Check `SETUP_SECRET` is set correctly
- Verify you're sending the correct secret in request

**Setup endpoint not found:**
- Make sure you deployed the latest code with setup endpoint
- Check URL: `/api/quizzes/setup/`

**Migrations not running:**
- Check `AUTO_MIGRATE=true` is set
- Check logs for errors
- Try Method 2 (HTTP endpoint) instead

