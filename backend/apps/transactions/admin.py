from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "transaction_id",
        "user",
        "date",
        "description",
        "amount",
        "transaction_type",
        "category",
        "is_reviewed",
        "created_at",
    ]

    list_filter = [
        "transaction_type",
        "category",
        "is_ai_categorized",
        "is_reviewed",
        "created_at",
    ]

    search_fields = [
        "transaction_id",
        "description",
        "merchant_name",
        "user__email",
    ]