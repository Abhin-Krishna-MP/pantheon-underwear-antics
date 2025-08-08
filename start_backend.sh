#!/bin/bash

# Activate virtual environment and start Django server
echo "Starting Django backend..."
cd "$(dirname "$0")"
source backend_env/bin/activate
python manage.py runserver 8000 