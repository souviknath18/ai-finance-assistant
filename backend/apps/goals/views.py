from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Goal
from .serializers import GoalSerializer, GoalCreateUpdateSerializer
from .services import get_goals_dashboard


class GoalListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(get_goals_dashboard(request.user))

    def post(self, request):
        serializer = GoalCreateUpdateSerializer(
            data=request.data,
            user=request.user,
        )

        if serializer.is_valid():
            goal = serializer.save(user=request.user)

            return Response(
                GoalSerializer(goal).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoalDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, goal_id):
        goal = get_object_or_404(
            Goal,
            goal_id=goal_id,
            user=request.user,
        )

        serializer = GoalCreateUpdateSerializer(
            goal,
            data=request.data,
            partial=True,
            user=request.user,
        )

        if serializer.is_valid():
            goal = serializer.save()
            return Response(GoalSerializer(goal).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, goal_id):
        goal = get_object_or_404(
            Goal,
            goal_id=goal_id,
            user=request.user,
        )

        goal.delete()

        return Response({"detail": "Goal deleted successfully."})