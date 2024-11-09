# urls.py
from django.urls import path
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('pubs/data/', views.pubs_data, name='pubs_data'),  # JSON data endpoint
    path('pubs/', views.pub_view, name='pubs'),  # Map view endpoint
]
