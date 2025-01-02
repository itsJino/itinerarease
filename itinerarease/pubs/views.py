from django.http import JsonResponse
from django.shortcuts import render, resolve_url, redirect
from .models import PublicPlace, UserProfile
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import SignupForm


def pubs_data(request):
    try:
        pubs = PublicPlace.objects.all()
        data = [
            {
                'name': pub.name,
                'latitude': pub.latitude,
                'longitude': pub.longitude,
                'address_1': pub.address_1,
                'address_2': pub.address_2,
                'address_3': pub.address_3,
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
        return redirect(resolve_url('pub_login'))

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
            return redirect('pub_map')  # Redirect to the main map view
    else:
        form = AuthenticationForm()
    return render(request, 'pubs/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect(resolve_url('pub_login'))  # Redirect to the login page after logout

def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('pub_login')  # Redirect to login page after signup
    else:
        form = SignupForm()
    return render(request, 'pubs/signup.html', {'form': form})

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