from django.urls import path
from django.contrib import admin
from .views import update_location_api, login_api_view, logout_api_view, signup_api_view, user_info_api, pubs_data_api
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login_api_view, name='login_api'),
    path('logout/', logout_api_view, name='logout_api'),
    path('signup/', signup_api_view, name='signup_api'),
    path('update-location/', update_location_api, name='update-location'),
    path('user-info-api/', user_info_api, name='user-info'),
    path('pubs-data/', pubs_data_api, name='pubs_data'),
]