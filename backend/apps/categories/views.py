from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from math import ceil

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

        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 5))

        page = max(page, 1)
        page_size = min(max(page_size, 1), 50)

        total = len(data)
        total_pages = ceil(total / page_size) if total else 0

        start = (page - 1) * page_size
        end = start + page_size

        return Response({
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
            "results": data[start:end],
        })
    

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