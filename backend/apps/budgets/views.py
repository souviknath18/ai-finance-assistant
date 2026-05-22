from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Budget
from .serializers import BudgetSerializer, BudgetCreateUpdateSerializer
from .services import get_budget_dashboard


class BudgetListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_budget_dashboard(request.user)
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BudgetCreateUpdateSerializer(data=request.data)

        if serializer.is_valid():
            budget = serializer.save(user=request.user)
            return Response(
                BudgetSerializer(budget).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, budget_id):
        budget = get_object_or_404(
            Budget,
            budget_id=budget_id,
            user=request.user,
        )

        serializer = BudgetCreateUpdateSerializer(
            budget,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            budget = serializer.save()
            return Response(BudgetSerializer(budget).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, budget_id):
        budget = get_object_or_404(
            Budget,
            budget_id=budget_id,
            user=request.user,
        )

        budget.delete()

        return Response(
            {"detail": "Budget deleted successfully."},
            status=status.HTTP_200_OK,
        )