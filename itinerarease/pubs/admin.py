from django.contrib.gis import admin
from .models import PublicPlace

admin.site.register(PublicPlace, admin.GISModelAdmin)