from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class Undergarment(models.Model):
    MATERIAL_CHOICES = [
        ('cotton', 'Cotton'),
        ('blend', 'Blend'),
        ('synthetic', 'Synthetic'),
        ('custom', 'Custom'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='undergarments')
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#FF6B6B')  # Hex color
    material = models.CharField(max_length=20, choices=MATERIAL_CHOICES, default='cotton')
    custom_washes = models.IntegerField(default=60)
    accessories = models.JSONField(default=list)  # Store as JSON array
    purchase_date = models.DateField()
    wash_count = models.IntegerField(default=0)
    retired = models.BooleanField(default=False)
    retired_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}'s {self.name}"

class Achievement(models.Model):
    ACHIEVEMENT_TYPES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
    ]
    
    undergarment = models.ForeignKey(Undergarment, on_delete=models.CASCADE, related_name='achievements')
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10)
    type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    unlocked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-unlocked_at']
    
    def __str__(self):
        return f"{self.undergarment.name} - {self.name}"
