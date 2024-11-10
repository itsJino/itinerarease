# urls.py
from django.urls import path
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('pubs/data/', views.pubs_data, name='pubs_data'),  # JSON data endpoint
    path('pubs/', views.pub_view, name='pub_map'),  # Map view endpoint
    path('login/', views.login_view, name='pub_login'),
    path('signup/', views.signup_view, name='pub_signup'),  # Ensure you have this view defined
    path('logout/', views.logout_view, name='pub_logout'),
    path('update_location/', views.update_location, name='update_location'),
]
