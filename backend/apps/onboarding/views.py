from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import OnboardingProfileSerializer
from .services import complete_onboarding


class CompleteOnboardingAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = OnboardingProfileSerializer(data=request.data)

        if serializer.is_valid():
            profile = complete_onboarding(
                user=request.user,
                data=serializer.validated_data,
            )

            return Response(
                {
                    "message": "Onboarding completed successfully.",
                    "is_onboarded": True,
                    "onboarding": OnboardingProfileSerializer(profile).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OnboardingProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, "onboarding_profile", None)

        if not profile:
            return Response(
                {"detail": "Onboarding profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            OnboardingProfileSerializer(profile).data,
            status=status.HTTP_200_OK,
        )