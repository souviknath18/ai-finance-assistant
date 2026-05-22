from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ai_engine.embeddings.semantic_search import (
    semantic_search_transactions,
    find_similar_transactions,
)


class SemanticSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get("query", "").strip()
        n_results = int(request.data.get("n_results", 5))

        if not query:
            return Response(
                {"detail": "Search query is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = semantic_search_transactions(
            user=request.user,
            query=query,
            n_results=n_results,
        )

        return Response(
            {
                "query": query,
                "count": len(results),
                "results": results,
            },
            status=status.HTTP_200_OK,
        )


class SimilarTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        transaction_id = request.data.get("transaction_id", "").strip()
        n_results = int(request.data.get("n_results", 5))

        if not transaction_id:
            return Response(
                {"detail": "Transaction ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = find_similar_transactions(
            user=request.user,
            transaction_id=transaction_id,
            n_results=n_results,
        )

        return Response(
            {
                "transaction_id": transaction_id,
                "count": len(results),
                "results": results,
            },
            status=status.HTTP_200_OK,
        )