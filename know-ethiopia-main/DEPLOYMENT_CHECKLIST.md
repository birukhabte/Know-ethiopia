# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### Repository Setup
- [ ] Code is committed to GitHub
- [ ] All sensitive data is in `.env` files (not committed)
- [ ] `.gitignore` is properly configured
- [ ] Dependencies are up to date (`npm audit` run)

### Environment Variables Prepared
- [ ] Supabase URL and keys ready
- [ ] Google OAuth credentials configured
- [ ] JWT secret generated (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] All required environment variables documented

## Backend Deployment (Render)

### Initial Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web service created with correct settings:
  - [ ] Root directory: `know-ethiopia-main/backend`
  - [ ] Build command: `npm install`
  - [ ] Start command: `npm start`
  - [ ] Node version: 14 or higher

### Environment Variables Set
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `JWT_SECRET` (generated)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_JWT_SECRET`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_CALLBACK_URL` (will update after deployment)
- [ ] `CLIENT_URL` (will update after frontend deployment)

### Deployment
- [ ] Service deployed successfully
- [ ] Backend URL noted: `_______________________________`
- [ ] Health check passes: `/api/health`
- [ ] Logs checked for errors

## Frontend Deployment (Vercel)

### Initial Setup
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project created with correct settings:
  - [ ] Root directory: `know-ethiopia-main/frontend`
  - [ ] Framework: Create React App
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `build`

### Environment Variables Set
- [ ] `REACT_APP_SUPABASE_URL`
- [ ] `REACT_APP_SUPABASE_ANON_KEY`
- [ ] `REACT_APP_API_BASE_URL` (backend URL from Render)

### Deployment
- [ ] Project deployed successfully
- [ ] Frontend URL noted: `_______________________________`
- [ ] App loads correctly
- [ ] No console errors

## Post-Deployment Configuration

### Update Backend
- [ ] Update `CLIENT_URL` in Render environment variables with Vercel URL
- [ ] Update `allowedOrigins` in `server.js` if needed
- [ ] Redeploy backend service
- [ ] Verify CORS is working

### Update Google OAuth
- [ ] Go to Google Cloud Console
- [ ] Update OAuth 2.0 Client:
  - [ ] Add Vercel URL to Authorized JavaScript origins
  - [ ] Add Render callback URL to Authorized redirect URIs
  - [ ] Format: `https://your-backend.onrender.com/auth/google/callback`
- [ ] Update `GOOGLE_CALLBACK_URL` in Render with actual URL
- [ ] Redeploy backend

### Update Supabase
- [ ] Go to Supabase dashboard → Authentication → URL Configuration
- [ ] Add Vercel URL to Site URL
- [ ] Add both URLs to Redirect URLs:
  - [ ] `https://your-frontend.vercel.app/*`
  - [ ] `https://your-backend.onrender.com/*`

## Testing

### Backend Tests
- [ ] Health check: `curl https://your-backend.onrender.com/api/health`
- [ ] Supabase health: `curl https://your-backend.onrender.com/api/health/supabase`
- [ ] CORS test from frontend domain
- [ ] Check Render logs for errors

### Frontend Tests
- [ ] Homepage loads
- [ ] Navigation works
- [ ] API calls succeed (check Network tab)
- [ ] Authentication flow works:
  - [ ] Google login
  - [ ] Token storage
  - [ ] Protected routes
- [ ] Map functionality works
- [ ] Search functionality works
- [ ] No console errors

### Integration Tests
- [ ] User can sign up/login
- [ ] User can view places
- [ ] User can save places
- [ ] User can submit feedback
- [ ] User can create posts
- [ ] All images load correctly

## Monitoring Setup

### Render
- [ ] Check deployment logs
- [ ] Set up log alerts (optional)
- [ ] Monitor service metrics

### Vercel
- [ ] Check deployment status
- [ ] Review function logs
- [ ] Set up analytics (optional)

## Security Verification

- [ ] HTTPS enabled on both services (automatic)
- [ ] Environment variables not exposed in client
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Helmet security headers active
- [ ] JWT secrets are strong and unique
- [ ] Google OAuth credentials secured

## Documentation

- [ ] Update README with production URLs
- [ ] Document any deployment-specific configurations
- [ ] Note any known issues or limitations
- [ ] Update API documentation if needed

## Rollback Plan

In case of issues:

### Backend Rollback
1. Go to Render dashboard
2. Navigate to your service
3. Click "Manual Deploy" → Select previous commit
4. Or revert environment variables if that's the issue

### Frontend Rollback
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

## Performance Optimization (Optional)

- [ ] Enable Vercel Analytics
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression

## Notes

**Backend URL:** _______________________________

**Frontend URL:** _______________________________

**Deployment Date:** _______________________________

**Issues Encountered:**
- 
- 
- 

**Resolutions:**
- 
- 
- 
