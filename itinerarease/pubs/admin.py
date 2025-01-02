from django.contrib.gis import admin
from .models import PublicPlace

@admin.register(PublicPlace)
class PublicPlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'address_1', 'address_2', 'address_3', 'county')
    
    