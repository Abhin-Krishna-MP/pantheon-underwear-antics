# Deployment Checklist

## Pre-Deployment
- [ ] Code is committed to Git repository
- [ ] All tests pass locally
- [ ] Environment variables are documented
- [ ] Database migrations are ready

## Backend Deployment
- [ ] Create Render Web Service
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `./build.sh`
- [ ] Set Start Command: `gunicorn wsgi:application`
- [ ] Create PostgreSQL database
- [ ] Set environment variables:
  - [ ] `DEBUG=False`
  - [ ] `SECRET_KEY=your-secret-key`
  - [ ] `ALLOWED_HOSTS=your-app.onrender.com`
  - [ ] `DATABASE_URL=postgresql://...`
  - [ ] `SESSION_COOKIE_SECURE=True`
  - [ ] `SESSION_COOKIE_DOMAIN=.onrender.com`
- [ ] Update CORS settings with frontend URL
- [ ] Deploy and test API endpoints

## Frontend Deployment
- [ ] Create Render Static Site
- [ ] Set Root Directory to `frontend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `dist`
- [ ] Set environment variable:
  - [ ] `VITE_API_BASE_URL=https://your-backend-app.onrender.com/api`
- [ ] Deploy and test frontend

## Post-Deployment Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test undergarment creation
- [ ] Test undergarment operations (wash, retire, delete)
- [ ] Test leaderboard functionality
- [ ] Check for CORS errors in browser console
- [ ] Verify all API endpoints work
- [ ] Test responsive design on mobile

## Monitoring
- [ ] Check Render logs for errors
- [ ] Monitor database connections
- [ ] Verify environment variables are loaded
- [ ] Test application performance

## Security Checklist
- [ ] DEBUG is set to False
- [ ] SECRET_KEY is strong and unique
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] No sensitive data in code
- [ ] Environment variables are secure 