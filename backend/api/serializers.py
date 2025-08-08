from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Undergarment, Achievement

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include username and password')

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon', 'type', 'unlocked_at']
        read_only_fields = ['id', 'unlocked_at']

class UndergarmentSerializer(serializers.ModelSerializer):
    achievements = AchievementSerializer(many=True, read_only=True)
    id = serializers.CharField(source='pk', read_only=True)  # Use pk as id to match localStorage
    purchase_date = serializers.DateField()
    retired_date = serializers.DateTimeField(allow_null=True)
    user = UserSerializer(read_only=True)  # Include user info for leaderboard
    
    class Meta:
        model = Undergarment
        fields = [
            'id', 'name', 'color', 'material', 'custom_washes', 
            'accessories', 'purchase_date', 'wash_count', 'retired', 
            'retired_date', 'achievements', 'user'
        ]
        read_only_fields = ['id', 'achievements', 'user']

class UndergarmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Undergarment
        fields = [
            'name', 'color', 'material', 'custom_washes', 
            'accessories', 'purchase_date'
        ] 