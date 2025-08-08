# Django Backend for UnderLiv

This is the Django backend for the UnderLiv application.

## Setup

1. **Activate the virtual environment:**
   ```bash
   source backend_env/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start the development server:**
   ```bash
   python manage.py runserver 8000
   ```

## API Endpoints

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user info

## Default Superuser

- Username: `admin`
- Email: `admin@example.com`
- Password: `admin123`

## Features

- Custom User model with email support
- Session-based authentication
- CORS support for frontend integration
- REST API endpoints for authentication
- Secure password handling

## Development

The backend runs on `http://localhost:8000` and the frontend should be configured to connect to this URL.

Make sure to update the `API_BASE_URL` in `src/hooks/useAuth.ts` if you change the backend URL. 