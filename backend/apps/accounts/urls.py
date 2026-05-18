from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import SignupAPIView, LoginAPIView, ProfileAPIView

urlpatterns = [
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
]