from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.utils import timezone
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UndergarmentSerializer, UndergarmentCreateSerializer, AchievementSerializer
from .models import User, Undergarment, Achievement

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
    return Response({'message': 'Logout successful'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    return Response({
        'user': UserSerializer(request.user).data
    })

# Undergarment views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def undergarment_list(request):
    """Get all undergarments for the authenticated user"""
    undergarments = Undergarment.objects.filter(user=request.user)
    serializer = UndergarmentSerializer(undergarments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def undergarment_create(request):
    """Create a new undergarment for the authenticated user"""
    serializer = UndergarmentCreateSerializer(data=request.data)
    if serializer.is_valid():
        undergarment = serializer.save(user=request.user)
        return Response(UndergarmentSerializer(undergarment).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def undergarment_update(request, pk):
    """Update an undergarment (wash, retire)"""
    try:
        undergarment = Undergarment.objects.get(id=pk, user=request.user)
    except Undergarment.DoesNotExist:
        return Response({'error': 'Undergarment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    action = request.data.get('action')
    
    if action == 'wash':
        undergarment.wash_count += 1
        undergarment.save()
        
        # Check for achievements
        check_achievements(undergarment)
        
    elif action == 'retire':
        undergarment.retired = True
        undergarment.retired_date = timezone.now()
        undergarment.save()
    
    return Response(UndergarmentSerializer(undergarment).data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def undergarment_delete(request, pk):
    """Delete an undergarment"""
    try:
        undergarment = Undergarment.objects.get(id=pk, user=request.user)
        undergarment.delete()
        return Response({'message': 'Undergarment deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Undergarment.DoesNotExist:
        return Response({'error': 'Undergarment not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request):
    """Get all undergarments from all users for leaderboard"""
    undergarments = Undergarment.objects.select_related('user').prefetch_related('achievements').all()
    serializer = UndergarmentSerializer(undergarments, many=True)
    return Response(serializer.data)

def check_achievements(undergarment):
    """Check and create achievements based on wash count"""
    wash_count = undergarment.wash_count
    
    # Fresh Prince achievement (10 washes)
    if wash_count == 10:
        Achievement.objects.get_or_create(
            undergarment=undergarment,
            name='Fresh Prince',
            defaults={
                'description': 'Washed 10 times - still looking royal!',
                'icon': '👑',
                'type': 'bronze'
            }
        )
    
    # Clean Machine achievement (25 washes)
    if wash_count == 25:
        Achievement.objects.get_or_create(
            undergarment=undergarment,
            name='Clean Machine',
            defaults={
                'description': 'Reached 25 washes - squeaky clean champion!',
                'icon': '🧽',
                'type': 'silver'
            }
        )
    
    # Wash Warrior achievement (50 washes)
    if wash_count == 50:
        Achievement.objects.get_or_create(
            undergarment=undergarment,
            name='Wash Warrior',
            defaults={
                'description': 'Survived 50 washes - legendary durability!',
                'icon': '⚔️',
                'type': 'gold'
            }
        )
