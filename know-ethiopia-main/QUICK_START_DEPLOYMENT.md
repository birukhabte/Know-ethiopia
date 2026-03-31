# Quick Start Deployment Guide

This is a simplified guide to get your app deployed quickly.

## Step 1: Generate Secrets

Run this command to generate a secure JWT secret:

```bash
node generate-secrets.js
```

Copy the JWT_SECRET value - you'll need it for Render.

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in these settings:

   ```
   Name: know-ethiopia-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: know-ethiopia-main/backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. Click "Advanced" and add environment variables:

   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<paste the generated secret>
   SUPABASE_URL=https://emcablnttsjydllmsmgd.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_U6gOcT-j8mV_gq0zi0dYEA_T3agdSIE
   SUPABASE_SERVICE_ROLE_KEY=<your service role key from .env>
   GOOGLE_CLIENT_ID=<your Google client ID from .env>
   GOOGLE_CLIENT_SECRET=<your Google client secret from .env>
   GOOGLE_CALLBACK_URL=https://YOUR-APP-NAME.onrender.com/auth/google/callback
   CLIENT_URL=https://YOUR-APP-NAME.vercel.app
   ```

   Note: Replace YOUR-APP-NAME with your actual app names (you'll update these after deployment)

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://know-ethiopia-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:

   ```
   Framework Preset: Create React App
   Root Directory: know-ethiopia-main/frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. Add environment variables:

   ```
   REACT_APP_SUPABASE_URL=https://emcablnttsjydllmsmgd.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=sb_publishable_U6gOcT-j8mV_gq0zi0dYEA_T3agdSIE
   REACT_APP_API_BASE_URL=<your Render backend URL>
   ```

6. Click "Deploy"
7. Wait for deployment (3-5 minutes)
8. Copy your frontend URL (e.g., `https://know-ethiopia.vercel.app`)

## Step 4: Update Backend Configuration

1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update these variables with your actual URLs:
   - `CLIENT_URL` → Your Vercel URL
   - `GOOGLE_CALLBACK_URL` → `https://your-backend.onrender.com/auth/google/callback`
5. Click "Save Changes"
6. Service will automatically redeploy

## Step 5: Update Google OAuth

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add to "Authorized JavaScript origins":
   - Your Vercel URL (e.g., `https://know-ethiopia.vercel.app`)
6. Add to "Authorized redirect URIs":
   - `https://your-backend.onrender.com/auth/google/callback`
7. Click "Save"

## Step 6: Test Your Deployment

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "db_connection": "connected"
}
```

### Test Frontend
1. Visit your Vercel URL
2. Check that the homepage loads
3. Try logging in with Google
4. Test navigation and features

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Make sure Supabase credentials are correct

### Frontend can't connect to backend
- Verify `REACT_APP_API_BASE_URL` is set correctly
- Check CORS errors in browser console
- Ensure `CLIENT_URL` in backend matches your Vercel URL

### Google login doesn't work
- Verify OAuth credentials are updated
- Check callback URL matches exactly
- Look for errors in Render logs

### Database connection fails
- Verify Supabase credentials
- Check Supabase dashboard for service status
- Review Render logs for specific error messages

## Important Notes

1. **Free Tier Limitations:**
   - Render: Service spins down after 15 minutes of inactivity (cold start on first request)
   - Vercel: 100GB bandwidth/month limit

2. **First Request Delay:**
   - On Render free tier, first request after inactivity takes 30-60 seconds
   - Subsequent requests are fast

3. **Environment Variables:**
   - Changes require redeployment
   - Never commit secrets to Git
   - Use different secrets for production vs development

4. **Automatic Deployments:**
   - Both services auto-deploy on Git push
   - Can be disabled in settings if needed

## Next Steps

- Set up custom domain (optional)
- Configure monitoring and alerts
- Set up error tracking (e.g., Sentry)
- Enable analytics
- Optimize performance

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Need help? Check the full DEPLOYMENT.md guide

---

**Your URLs:**

Backend: _______________________________

Frontend: _______________________________

Deployed on: _______________________________
