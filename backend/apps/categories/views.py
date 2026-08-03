from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from math import ceil
from decimal import Decimal
from .models import Category
from .services import (
    create_category,
    get_category_options,
    get_category_summary,
    get_custom_categories,
    get_top_category_distribution,
    merge_categories,
    soft_delete_category,
    update_category,
)
from .serializers import CategorySerializer, MergeCategorySerializer
from django.shortcuts import get_object_or_404


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


class CategoryDistributionView(
    APIView
):
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        raw_limit = request.GET.get(
            "limit",
            5,
        )

        try:
            limit = int(raw_limit)
        except (
            TypeError,
            ValueError,
        ):
            limit = 5

        distribution = (
            get_top_category_distribution(
                user=request.user,
                limit=limit,
            )
        )

        data = distribution[
            "results"
        ]

        top_categories_spending = sum(
            (
                Decimal(
                    item["spending"]
                )
                for item in data
            ),
            Decimal("0.00"),
        )

        results = []

        for item in data:
            spending = Decimal(
                item["spending"]
            )

            percentage = (
                (
                    spending
                    / top_categories_spending
                )
                * Decimal("100")
                if top_categories_spending > 0
                else Decimal("0.00")
            )

            results.append(
                {
                    **item,
                    "percentage": str(
                        percentage.quantize(
                            Decimal("0.01")
                        )
                    ),
                }
            )

        return Response(
            {
                "month": distribution[
                    "month"
                ],
                "month_label": distribution[
                    "month_label"
                ],
                "count": len(results),
                "total_spending": str(
                    top_categories_spending
                ),
                "results": results,
            }
        )


class CategoryMergeView(APIView):
    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):
        serializer = MergeCategorySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        result = merge_categories(
            user=request.user,
            source_category_id=(
                serializer.validated_data[
                    "source_category_id"
                ]
            ),
            destination_category_id=(
                serializer.validated_data[
                    "destination_category_id"
                ]
            ),
        )

        return Response(
            {
                "detail": (
                    "Category merged successfully."
                ),
                **result,
            },
            status=status.HTTP_200_OK,
        )


class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_category(
        self,
        request,
        category_id,
    ):
        return get_object_or_404(
            Category,
            user=request.user,
            category_id=category_id,
            is_active=True,
        )

    def patch(
        self,
        request,
        category_id,
    ):
        category = self.get_category(
            request,
            category_id,
        )

        if category.is_system:
            return Response(
                {
                    "detail": (
                        "System categories cannot be edited."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CategorySerializer(
            category,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        category = update_category(
            category=category,
            validated_data=serializer.validated_data,
        )

        return Response(
            CategorySerializer(
                category
            ).data,
            status=status.HTTP_200_OK,
        )

    def delete(
        self,
        request,
        category_id,
    ):
        soft_delete_category(
            user=request.user,
            category_id=category_id,
        )

        return Response(
            {
                "detail": (
                    "Category deleted successfully."
                )
            },
            status=status.HTTP_200_OK,
        )