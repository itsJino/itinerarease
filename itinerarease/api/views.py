from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.gis.geos import Point
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets
from knox.auth import TokenAuthentication
from knox.models import AuthToken
from pubs.models import PublicPlace, UserProfile
from pubs.serializers import PublicPlaceSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def pubs_data_api(request):
    """
    API endpoint for fetching public places data.
    """
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
                'county': pub.county,
            }
            for pub in pubs
        ]
        return Response(data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api_view(request):
    """
    Knox-based API endpoint for user login.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        token = AuthToken.objects.create(user)[1]
        return Response({"success": "Logged in successfully", "token": token}, status=200)
    return Response({"error": "Invalid username or password"}, status=401)


@api_view(['POST'])
def logout_api_view(request):
    """
    Knox-based API endpoint for user logout.
    """
    request._auth.delete()  # Delete the token used for authentication
    return Response({"success": "Logged out successfully"}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api_view(request):
    """
    API endpoint for user registration.
    """
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not password or not confirm_password:
        return Response({"error": "Password and confirmation are required"}, status=400)

    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=400)

    try:
        validate_password(password)  # Validate the password according to Django standards
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return Response({"success": "User registered successfully!"}, status=201)
    except ValidationError as e:
        return Response({"error": e.messages}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info_api(request):
    """
    API endpoint to fetch user info for authenticated users.
    """
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_location_api(request):
    """
    API endpoint for updating user location.
    """
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")

    if latitude and longitude:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.location = Point(float(longitude), float(latitude))
        profile.save()
        return Response({"success": True}, status=200)
    return Response({"success": False, "error": "Invalid request"}, status=400)

class PublicPlaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for listing and creating public places.
    """
    queryset = PublicPlace.objects.all()
    serializer_class = PublicPlaceSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

