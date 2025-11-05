# 🚀 Quick Setup Guide - Load Chapters & Questions

## Problem: "No chapters available at the moment"

This means the database setup hasn't been run yet. Follow these steps:

## Step 1: Add SETUP_SECRET (If Not Already Added)

1. Go to **Render Dashboard** → Your service
2. Click **"Environment"** tab
3. Check if `SETUP_SECRET` exists
4. If not, add it:
   - Key: `SETUP_SECRET`
   - Value: `rankcatalyst-setup-2024` (or any password you choose)
5. Click **"Save Changes"** and wait for redeploy

## Step 2: Run Setup Endpoint

Open your browser console (F12) and run:

```javascript
fetch('https://rankcatalystet.onrender.com/api/quizzes/setup/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    secret: 'rankcatalyst-setup-2024',  // Use the same secret you set above
    admin_email: 'admin@rankcatalyst.com',
    admin_password: 'admin123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Setup Response:', data);
  if (data.results) {
    console.log('📊 Results:');
    console.log('  - Migrations:', data.results.migrations);
    console.log('  - Superuser:', data.results.superuser);
    console.log('  - Questions:', data.results.questions);
  }
  if (data.status === 'completed') {
    console.log('✅ Setup completed! Refresh the page and chapters should appear.');
  }
})
.catch(err => {
  console.error('❌ Error:', err);
});
```

## Step 3: Verify Setup

After running the setup, check the console output. You should see:
- `migrations: "success"`
- `superuser: "success: created admin@rankcatalyst.com"` or `"skipped: superuser already exists"`
- `questions: "success"`

## Step 4: Refresh Your Frontend

1. Go back to your deployed frontend
2. Log out and log back in
3. Chapters should now appear!

## Alternative: Use Online Tool

1. Go to https://reqbin.com/curl
2. Set **Method** to `POST`
3. Set **URL** to: `https://rankcatalystet.onrender.com/api/quizzes/setup/`
4. In **Headers**, add:
   ```
   Content-Type: application/json
   ```
5. In **Body**, paste:
   ```json
   {
     "secret": "rankcatalyst-setup-2024",
     "admin_email": "admin@rankcatalyst.com",
     "admin_password": "admin123"
   }
   ```
6. Click **"Send"**
7. Check the response - should show `"status": "completed"`

## Troubleshooting

### If you get "Invalid setup secret":
- Make sure `SETUP_SECRET` environment variable is set in Render
- Make sure the `secret` in the request body matches exactly

### If you get 404:
- Check that your service URL is correct
- Make sure the endpoint path is `/api/quizzes/setup/` (with trailing slash)

### If migrations fail:
- Check Render logs for detailed error messages
- Make sure `DATABASE_URL` is set correctly in environment variables

### If chapters still don't appear:
1. Check browser console for API errors
2. Verify you're logged in (check localStorage for `access` token)
3. Try accessing: `https://rankcatalystet.onrender.com/api/quizzes/chapters/` directly
4. Check Render logs for any errors

## What the Setup Does

1. ✅ Runs all database migrations (creates tables)
2. ✅ Creates 4 chapters (P-Block, Thermodynamics, Gaseous State, Mole Concept)
3. ✅ Loads all questions from JSON files into the database
4. ✅ Creates a superuser for admin access

After this, your database will be fully populated!

