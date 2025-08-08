# Deployment Guide for Pantheon Underwear Antics

This guide will help you deploy both the Django backend and React frontend to Render.

## Project Structure

```
pantheon-underwear-antics/
├── backend/          # Django API
├── frontend/         # React Frontend
└── README.md
```

## Prerequisites

1. A Render account (free tier available)
2. Git repository with your code
3. PostgreSQL database (Render provides this)

## Backend Deployment (Django API)

### Step 1: Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `pantheon-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn wsgi:application`

### Step 2: Configure Environment Variables

Add these environment variables in your Render service settings:

```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=your-backend-app.onrender.com
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_DOMAIN=.onrender.com
```

### Step 3: Set Up PostgreSQL Database

1. Create a new PostgreSQL service on Render
2. Copy the database URL
3. Add it as `DATABASE_URL` environment variable in your backend service

### Step 4: Update CORS Settings

In `backend/settings.py`, update the CORS settings with your frontend URL:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-app.onrender.com",
    # ... other origins
]

CSRF_TRUSTED_ORIGINS = [
    "https://your-frontend-app.onrender.com",
    # ... other origins
]
```

## Frontend Deployment (React App)

### Step 1: Create a New Static Site on Render

1. Go to your Render dashboard
2. Click "New +" and select "Static Site"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `pantheon-frontend` (or your preferred name)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 2: Configure Environment Variables

Add this environment variable in your Render service settings:

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

### Step 3: Update Vite Configuration (if needed)

Make sure your `frontend/vite.config.ts` is configured for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

## Deployment Steps Summary

### Backend Deployment
1. ✅ Create Web Service on Render
2. ✅ Set environment variables
3. ✅ Connect PostgreSQL database
4. ✅ Update CORS settings
5. ✅ Deploy

### Frontend Deployment
1. ✅ Create Static Site on Render
2. ✅ Set environment variables
3. ✅ Deploy

## Post-Deployment

### 1. Test Your API Endpoints

Test your backend API:
```bash
curl https://your-backend-app.onrender.com/api/auth/user/
```

### 2. Test Frontend-Backend Communication

1. Open your frontend URL
2. Try to register/login
3. Check browser console for any CORS errors

### 3. Monitor Logs

- Check Render logs for any errors
- Monitor database connections
- Verify environment variables are loaded correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend URL is in the CORS_ALLOWED_ORIGINS list
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Static Files**: Ensure whitenoise is properly configured
4. **Environment Variables**: Check that all required variables are set

### Debug Commands

```bash
# Check backend logs
curl https://your-backend-app.onrender.com/api/auth/user/

# Check frontend build
npm run build

# Test local development
cd backend && python manage.py runserver
cd frontend && npm run dev
```

## Environment Variables Reference

### Backend (.env)
```
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=postgresql://...
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_DOMAIN=.onrender.com
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

## Security Notes

1. Never commit `.env` files to Git
2. Use strong SECRET_KEY in production
3. Enable HTTPS in production
4. Set DEBUG=False in production
5. Use environment variables for sensitive data

## Cost Optimization

- Use Render's free tier for development
- Monitor usage to avoid unexpected charges
- Consider using free PostgreSQL alternatives for development

## Support

If you encounter issues:
1. Check Render's documentation
2. Review application logs
3. Test locally first
4. Verify all environment variables are set correctly 