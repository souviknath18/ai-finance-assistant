from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import (
    create_category,
    get_category_options,
    get_category_summary,
    get_custom_categories,
    soft_delete_category,
)
from .serializers import CategorySerializer


class CategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = get_custom_categories(request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            category = create_category(
                user=request.user,
                validated_data=serializer.validated_data,
            )

            return Response(
                CategorySerializer(category).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CategoryOptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = get_category_options(request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CategorySummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_category_summary(request.user)
        return Response(data)
    

class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, category_id):
        soft_delete_category(
            user=request.user,
            category_id=category_id,
        )

        return Response(
            {"detail": "Category deleted successfully."},
            status=status.HTTP_200_OK,
        )