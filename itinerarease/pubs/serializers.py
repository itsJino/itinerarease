from .models import PublicPlace
from rest_framework import serializers
 
class PublicPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicPlace
        fields = ("name", "longitude", "latitude", "address_1", "address_2", "address_3", "county")