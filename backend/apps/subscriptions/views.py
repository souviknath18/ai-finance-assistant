from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import detect_subscriptions


class DetectedSubscriptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = detect_subscriptions(request.user)
        return Response(data)