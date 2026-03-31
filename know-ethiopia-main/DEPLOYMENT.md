# Deployment Guide

This guide covers deploying the Know Ethiopia application with the frontend on Vercel and the backend on Render.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- Supabase project (for database)

## Backend Deployment (Render)

### Step 1: Prepare Your Repository

1. Push your code to GitHub if you haven't already:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Render

1. Go to https://dashboard.render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `know-ethiopia-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `know-ethiopia-main/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)

### Step 3: Configure Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=<generate-a-long-random-string>
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
SUPABASE_JWT_SECRET=<your-supabase-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/auth/google/callback
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your backend URL (e.g., `https://know-ethiopia-backend.onrender.com`)

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `know-ethiopia-main/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 2: Configure Environment Variables

Add these environment variables in Vercel dashboard (Settings → Environment Variables):

```
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete
3. Note your frontend URL (e.g., `https://know-ethiopia.vercel.app`)

## Post-Deployment Configuration

### Update Backend CORS

1. Go back to Render dashboard
2. Update the `CLIENT_URL` environment variable with your actual Vercel URL
3. Update the backend code's `allowedOrigins` array if needed (in `server.js`)
4. Redeploy the backend

### Update Google OAuth

1. Go to Google Cloud Console
2. Update OAuth 2.0 credentials:
   - **Authorized JavaScript origins**: Add your Vercel URL
   - **Authorized redirect URIs**: Add `https://your-backend-url.onrender.com/auth/google/callback`

### Update Supabase (if needed)

1. Go to Supabase dashboard
2. Update allowed URLs in Authentication settings
3. Add your Vercel and Render URLs

## Verification

### Test Backend

```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "...",
  "environment": "production",
  "db_connection": "connected"
}
```

### Test Frontend

1. Visit your Vercel URL
2. Check that the app loads correctly
3. Test authentication flow
4. Verify API calls are working

## Troubleshooting

### Backend Issues

- **503 Service Unavailable**: Check Render logs for database connection issues
- **CORS errors**: Verify `CLIENT_URL` environment variable matches your Vercel URL
- **Authentication fails**: Check Google OAuth credentials and callback URL

### Frontend Issues

- **API calls fail**: Verify `REACT_APP_API_BASE_URL` is set correctly
- **Build fails**: Check for missing dependencies or environment variables
- **Blank page**: Check browser console for errors

### Common Issues

1. **Cold starts on Render Free tier**: First request may be slow (15-30 seconds)
2. **Environment variables**: Must be set before deployment
3. **HTTPS required**: Both services use HTTPS by default

## Monitoring

### Render

- View logs: Dashboard → Your Service → Logs
- Monitor metrics: Dashboard → Your Service → Metrics

### Vercel

- View deployments: Dashboard → Your Project → Deployments
- Check analytics: Dashboard → Your Project → Analytics
- View logs: Click on a deployment → Function Logs

## Continuous Deployment

Both platforms support automatic deployments:

- **Vercel**: Automatically deploys on push to main branch
- **Render**: Automatically deploys on push to main branch

To disable auto-deploy, adjust settings in respective dashboards.

## Cost Considerations

### Free Tier Limits

**Render Free Tier:**
- 750 hours/month
- Spins down after 15 minutes of inactivity
- Cold start delay on first request

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless function execution limits

### Upgrading

Consider upgrading if you experience:
- Frequent cold starts (Render)
- High traffic (both)
- Need for custom domains (both offer on paid plans)

## Security Checklist

- [ ] All environment variables are set
- [ ] JWT_SECRET is a strong random string
- [ ] Google OAuth credentials are updated
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (default on both platforms)
- [ ] Supabase RLS policies are configured
- [ ] API rate limiting is enabled

## Support

- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
