from django.http import JsonResponse
from django.shortcuts import render
from .models import PublicPlace
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from .models import UserProfile
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect

def pubs_data(request):
    try:
        pubs = PublicPlace.objects.all()
        data = [
            {
                'name': pub.name,
                'latitude': pub.latitude,
                'longitude': pub.longitude,
                'region': pub.region,
            }
            for pub in pubs
        ]
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def pub_view(request):
    if request.user.is_authenticated:
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            location = user_profile.location
        except UserProfile.DoesNotExist:
            location = None
        return render(request, 'pubs/pubs.html', {'user': request.user, 'location': location})
    else:
        return redirect('login')

User = get_user_model()

def set_user_location(user_id, latitude, longitude):
    user = User.objects.get(id=user_id)
    location = Point(longitude, latitude)  # Note: Point takes (longitude, latitude)

    # Create or update the user's profile
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.location = location
    profile.save()

    return profile

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')  # Redirect to the main map view
    else:
        form = AuthenticationForm()
    return render(request, 'world/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')  # Redirect to the login page after logout

def update_location(request):
    if request.method == 'POST' and request.user.is_authenticated:
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')

        if latitude and longitude:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
                location = Point(longitude, latitude)
                
                profile, created = UserProfile.objects.get_or_create(user=request.user)
                profile.location = location
                profile.save()

                return JsonResponse({'success': True})
            except ValueError:
                return JsonResponse({'success': False, 'error': 'Invalid coordinates'})
        else:
            return JsonResponse({'success': False, 'error': 'Missing coordinates'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})