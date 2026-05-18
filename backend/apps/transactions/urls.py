from django.urls import path
from .views import (
    TransactionListCreateView,
    TransactionDetailView,
    TransactionBulkDeleteView,
)

urlpatterns = [
    path("", TransactionListCreateView.as_view(), name="transaction-list-create"),
    path("bulk-delete/", TransactionBulkDeleteView.as_view(), name="transaction-bulk-delete"),
    path("<str:transaction_id>/", TransactionDetailView.as_view(), name="transaction-detail"),
]