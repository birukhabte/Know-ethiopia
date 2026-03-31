# Know Ethiopia - Deployment Files

This directory contains all the files you need to deploy the Know Ethiopia application.

## Files Overview

### Configuration Files

1. **`backend/render.yaml`**
   - Render.com configuration for backend deployment
   - Defines service settings and environment variables
   - Used for Infrastructure as Code deployment (optional)

2. **`frontend/vercel.json`**
   - Vercel configuration for frontend deployment
   - Handles routing, headers, and build settings
   - Automatically detected by Vercel

3. **`generate-secrets.js`**
   - Node.js script to generate secure JWT secrets
   - Run with: `node generate-secrets.js`
   - Use output for Render environment variables

### Documentation Files

1. **`QUICK_START_DEPLOYMENT.md`** ⭐ START HERE
   - Simplified step-by-step deployment guide
   - Perfect for first-time deployment
   - Includes troubleshooting tips

2. **`DEPLOYMENT.md`**
   - Comprehensive deployment documentation
   - Detailed explanations of each step
   - Includes monitoring and security sections

3. **`DEPLOYMENT_CHECKLIST.md`**
   - Interactive checklist for deployment
   - Helps ensure nothing is missed
   - Useful for tracking progress

4. **`README_DEPLOYMENT.md`** (this file)
   - Overview of deployment files
   - Quick reference guide

## Quick Start

If this is your first time deploying:

1. Read `QUICK_START_DEPLOYMENT.md`
2. Generate secrets: `node generate-secrets.js`
3. Follow the step-by-step guide
4. Use `DEPLOYMENT_CHECKLIST.md` to track progress

## Deployment Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ├─────────────────────────────┐
         │                             │
         ▼                             ▼
┌─────────────────┐          ┌─────────────────┐
│  Vercel         │          │  Render         │
│  (Frontend)     │◄────────►│  (Backend)      │
│                 │   API    │                 │
│  React App      │  Calls   │  Express API    │
└─────────────────┘          └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │  Supabase       │
                             │  (Database)     │
                             │                 │
                             │  PostgreSQL     │
                             └─────────────────┘
```

## Environment Variables Reference

### Backend (Render)

Required:
- `NODE_ENV` - Set to "production"
- `PORT` - Set to 10000 (Render default)
- `JWT_SECRET` - Generate with generate-secrets.js
- `SUPABASE_URL` - From Supabase dashboard
- `SUPABASE_ANON_KEY` - From Supabase dashboard
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_CALLBACK_URL` - Your Render URL + /auth/google/callback
- `CLIENT_URL` - Your Vercel frontend URL

### Frontend (Vercel)

Required:
- `REACT_APP_SUPABASE_URL` - From Supabase dashboard
- `REACT_APP_SUPABASE_ANON_KEY` - From Supabase dashboard
- `REACT_APP_API_BASE_URL` - Your Render backend URL

## Deployment Platforms

### Why Vercel for Frontend?
- Optimized for React applications
- Automatic HTTPS and CDN
- Zero-config deployments
- Excellent performance
- Free tier is generous

### Why Render for Backend?
- Native Node.js support
- Easy environment variable management
- Automatic HTTPS
- Good free tier
- Simple deployment process

### Why Supabase for Database?
- PostgreSQL database
- Built-in authentication
- Real-time capabilities
- Generous free tier
- Easy to use

## Common Issues

### Issue: Backend returns 503
**Solution:** Check Supabase credentials and connection

### Issue: CORS errors
**Solution:** Verify CLIENT_URL matches your Vercel URL exactly

### Issue: Google login fails
**Solution:** Update OAuth credentials with production URLs

### Issue: Cold start delays (Render free tier)
**Solution:** This is normal - first request takes 30-60 seconds

## Post-Deployment

After successful deployment:

1. Update `server.js` allowedOrigins with your production URLs
2. Configure custom domains (optional)
3. Set up monitoring
4. Enable analytics
5. Configure error tracking

## Security Checklist

- [ ] All secrets are environment variables (not in code)
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on both platforms)
- [ ] Rate limiting is active
- [ ] JWT secrets are strong and unique
- [ ] Google OAuth is configured correctly
- [ ] Supabase RLS policies are set up

## Monitoring

### Render
- Logs: Dashboard → Service → Logs
- Metrics: Dashboard → Service → Metrics
- Health: `https://your-backend.onrender.com/api/health`

### Vercel
- Deployments: Dashboard → Project → Deployments
- Analytics: Dashboard → Project → Analytics
- Logs: Click deployment → Function Logs

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)

## Updating Your Deployment

### Backend Updates
1. Push changes to GitHub
2. Render automatically deploys
3. Check logs for errors

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically deploys
3. Check deployment status

### Environment Variable Updates
1. Update in platform dashboard
2. Service will automatically redeploy
3. Verify changes took effect

## Cost Estimates

### Free Tier (Current Setup)
- Render: Free (with cold starts)
- Vercel: Free (100GB bandwidth/month)
- Supabase: Free (500MB database, 2GB bandwidth)
- **Total: $0/month**

### Paid Tier (Recommended for Production)
- Render: $7/month (no cold starts)
- Vercel: $20/month (more bandwidth)
- Supabase: $25/month (8GB database, 50GB bandwidth)
- **Total: ~$52/month**

## Next Steps

1. Complete deployment using QUICK_START_DEPLOYMENT.md
2. Test all functionality
3. Set up custom domain (optional)
4. Configure monitoring
5. Plan for scaling if needed

---

**Need Help?**

Check the troubleshooting sections in:
- QUICK_START_DEPLOYMENT.md
- DEPLOYMENT.md

Or review the platform documentation linked above.
