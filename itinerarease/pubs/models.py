# models.py
from django.contrib.gis.db import models
from django.contrib.auth import get_user_model

class PublicPlace(models.Model):
    name = models.CharField(max_length=255)
    longitude = models.FloatField()
    latitude = models.FloatField()
    region = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.PointField(null=True, blank=True)

    def __str__(self):
        return self.user.username
