# models.py
from django.contrib.gis.db import models
from django.contrib.auth import get_user_model

class PublicPlace(models.Model):
    name = models.CharField(max_length=255)
    longitude = models.FloatField()
    latitude = models.FloatField()
    address_1 = models.CharField(max_length=255, null=True, blank=True)
    address_2 = models.CharField(max_length=255, null=True, blank=True)
    address_3 = models.CharField(max_length=255, null=True, blank=True)
    county = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.name
    
User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.PointField(null=True, blank=True)

    def __str__(self):
        return self.user.username
