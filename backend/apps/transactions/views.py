from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transaction
from .serializers import TransactionSerializer, TransactionCreateSerializer


class TransactionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)

        search = request.GET.get("search")
        category = request.GET.get("category")
        transaction_type = request.GET.get("type")

        if search:
            transactions = transactions.filter(description__icontains=search)

        if category:
            transactions = transactions.filter(category__iexact=category)

        if transaction_type:
            transactions = transactions.filter(transaction_type=transaction_type)

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionCreateSerializer(data=request.data)

        if serializer.is_valid():
            transaction = serializer.save(user=request.user)

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
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, transaction_id):
        transaction = self.get_object(request, transaction_id)
        transaction.delete()

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

        deleted_count, _ = Transaction.objects.filter(
            user=request.user,
            transaction_id__in=transaction_ids,
        ).delete()

        return Response(
            {
                "detail": "Transactions deleted successfully.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )