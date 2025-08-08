from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/user/', views.user_info, name='user_info'),
    
    # Undergarment endpoints
    path('undergarments/', views.undergarment_list, name='undergarment_list'),
    path('undergarments/create/', views.undergarment_create, name='undergarment_create'),
    path('undergarments/<int:pk>/update/', views.undergarment_update, name='undergarment_update'),
    path('undergarments/<int:pk>/delete/', views.undergarment_delete, name='undergarment_delete'),
] 