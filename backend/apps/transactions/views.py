from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from math import ceil
from django.db.models import Q
from .models import Transaction
from apps.insights.services import mark_insights_stale
from apps.reports.services import mark_report_dashboard_stale
from .serializers import TransactionSerializer, TransactionCreateSerializer
from ai_engine.embeddings.vector_store import delete_transaction_vector


class TransactionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).select_related(
            "uploaded_file"
        )

        search = request.GET.get("search", "").strip()
        category = request.GET.get("category", "").strip()
        transaction_type = request.GET.get("type", "").strip()
        status_filter = request.GET.get("status", "").strip()
        start_date = request.GET.get("start_date", "").strip()
        end_date = request.GET.get("end_date", "").strip()

        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 10))

        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        if search:
            transactions = transactions.filter(
                Q(description__icontains=search)
                | Q(merchant_name__icontains=search)
                | Q(category__icontains=search)
            )

        if category and category != "all":
            transactions = transactions.filter(category__iexact=category)

        if transaction_type and transaction_type != "all":
            transactions = transactions.filter(transaction_type=transaction_type)

        if start_date:
            transactions = transactions.filter(date__gte=start_date)

        if end_date:
            transactions = transactions.filter(date__lte=end_date)

        if status_filter and status_filter != "all":
            if status_filter == "AI Verified":
                transactions = transactions.filter(category_source="ai").exclude(
                    category__isnull=True
                ).exclude(category="Uncategorized")

            elif status_filter == "Rule Verified":
                transactions = transactions.filter(category_source="rule")

            elif status_filter == "User Verified":
                transactions = transactions.filter(category_source="user")

            elif status_filter == "AI Review Needed":
                transactions = transactions.filter(
                    Q(category__isnull=True)
                    | Q(category="")
                    | Q(category="Uncategorized")
                    | Q(category_source="none")
                )

        total = transactions.count()
        total_pages = ceil(total / page_size) if total else 0

        start = (page - 1) * page_size
        end = start + page_size

        serializer = TransactionSerializer(transactions[start:end], many=True)

        return Response(
            {
                "count": total,
                "total_pages": total_pages,
                "current_page": page,
                "page_size": page_size,
                "results": serializer.data,
            }
        )

    def post(self, request):
        serializer = TransactionCreateSerializer(data=request.data)

        if serializer.is_valid():
            transaction = serializer.save(user=request.user)

            mark_insights_stale(request.user)
            mark_report_dashboard_stale(request.user)

            response_serializer = TransactionSerializer(transaction)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, transaction_id):
        return Transaction.objects.get(
            transaction_id=transaction_id,
            user=request.user,
        )

    def get(self, request, transaction_id):
        transaction = self.get_object(request, transaction_id)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    def patch(self, request, transaction_id):
        transaction = self.get_object(request, transaction_id)

        serializer = TransactionSerializer(
            transaction,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            mark_insights_stale(request.user)
            mark_report_dashboard_stale(request.user)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, transaction_id):
        transaction = self.get_object(request, transaction_id)

        try:
            delete_transaction_vector(transaction.transaction_id)
        except Exception as error:
            print("Vector delete failed:", error)

        transaction.delete()

        mark_insights_stale(request.user)
        mark_report_dashboard_stale(request.user)

        return Response(
            {"detail": "Transaction deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class TransactionBulkDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        transaction_ids = request.data.get("transaction_ids", [])

        if not transaction_ids:
            return Response(
                {"detail": "No transactions selected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        transactions = Transaction.objects.filter(
            user=request.user,
            transaction_id__in=transaction_ids,
        )

        for transaction in transactions:
            try:
                delete_transaction_vector(transaction.transaction_id)
            except Exception as error:
                print("Vector delete failed:", error)

        deleted_count, _ = transactions.delete()

        mark_insights_stale(request.user)
        mark_report_dashboard_stale(request.user)

        return Response(
            {
                "detail": "Transactions deleted successfully.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )