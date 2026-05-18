from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


def generate_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def create_user_account(*, full_name, email, password):
    return User.objects.create_user(
        full_name=full_name,
        email=email,
        password=password,
    )


def authenticate_user(*, request, email, password):
    return authenticate(
        request=request,
        username=email,
        password=password,
    )