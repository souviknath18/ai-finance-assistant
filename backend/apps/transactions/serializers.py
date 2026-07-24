from calendar import monthrange
from datetime import date
from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    uploaded_file_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            "id",
            "transaction_id",
            "uploaded_file",
            "uploaded_file_name",
            "date",
            "date_is_estimated",
            "description",
            "merchant_name",
            "reference_number",
            "amount",
            "transaction_type",
            "category",
            "category_source",
            "balance_after_transaction",
            "is_ai_categorized",
            "ai_confidence",
            "ai_reason",
            "is_reviewed",
            "raw_text",
            "is_vectorized",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "transaction_id",
            "created_at",
            "updated_at",
        ]

    def get_uploaded_file_name(self, obj):
        if obj.uploaded_file:
            return obj.uploaded_file.original_filename
        return None


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "date",
            "description",
            "merchant_name",
            "reference_number",
            "amount",
            "transaction_type",
            "category",
            "balance_after_transaction",
            "raw_text",
        ]


class TransactionDetailsSerializer(TransactionSerializer):
    status = serializers.SerializerMethodField()
    review_needed = serializers.SerializerMethodField()
    is_recurring = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    previous_payments = serializers.SerializerMethodField()
    ai = serializers.SerializerMethodField()
    merchant = serializers.SerializerMethodField()
    trend = serializers.SerializerMethodField()
    optimization_tips = serializers.SerializerMethodField()

    class Meta(TransactionSerializer.Meta):
        fields = TransactionSerializer.Meta.fields + [
            "status",
            "review_needed",
            "is_recurring",
            "source",
            "previous_payments",
            "ai",
            "merchant",
            "trend",
            "optimization_tips",
        ]

    def get_review_needed(self, obj):
        if (
            not obj.category
            or obj.category == "Uncategorized"
            or obj.category_source == Transaction.CategorySource.NONE
        ):
            return True

        if (
            obj.category_source == Transaction.CategorySource.AI
            and obj.ai_confidence is not None
            and obj.ai_confidence < Decimal("0.85")
        ):
            return True

        return False

    def get_status(self, obj):
        if self.get_review_needed(obj):
            return "AI Review Needed"

        if obj.category_source == Transaction.CategorySource.AI:
            return "AI Verified"

        if obj.category_source == Transaction.CategorySource.RULE:
            return "Rule Verified"

        if obj.category_source == Transaction.CategorySource.USER:
            return "User Verified"

        return "Manual"

    def _matching_transactions(self, obj):
        queryset = Transaction.objects.filter(
            user=obj.user,
        ).exclude(pk=obj.pk)

        if obj.merchant_name:
            return queryset.filter(
                merchant_name__iexact=obj.merchant_name,
            )

        return queryset.filter(
            description__iexact=obj.description,
        )

    def get_is_recurring(self, obj):
        # This is an initial recurring-payment inference.
        # Later you can replace it with stricter monthly-pattern detection.
        return self._matching_transactions(obj).exists()

    def get_source(self, obj):
        uploaded_file = obj.uploaded_file

        if not uploaded_file:
            return None

        uploaded_at = getattr(uploaded_file, "created_at", None)
        processed_at = getattr(uploaded_file, "processed_at", None)
        upload_id = getattr(uploaded_file, "upload_id", None)

        return {
            "id": uploaded_file.pk,
            "upload_id": upload_id,
            "filename": uploaded_file.original_filename,
            "file_type": uploaded_file.file_type,
            "uploaded_at": uploaded_at,
            "processed_at": processed_at,
        }

    def get_previous_payments(self, obj):
        transactions = (
            self._matching_transactions(obj)
            .select_related("uploaded_file")
            .order_by("-date", "-created_at")[:5]
        )

        return [
            {
                "transaction_id": transaction.transaction_id,
                "date": transaction.date,
                "description": transaction.description,
                "merchant_name": transaction.merchant_name,
                "amount": transaction.amount,
                "transaction_type": transaction.transaction_type,
                "category": transaction.category,
                "status": self.get_status(transaction),
            }
            for transaction in transactions
        ]

    def get_ai(self, obj):
        category_source = obj.category_source

        if (
            category_source == Transaction.CategorySource.NONE
            and obj.ai_confidence is None
            and not obj.ai_reason
        ):
            return None

        confidence = (
            obj.ai_confidence
            if category_source == Transaction.CategorySource.AI
            else None
        )

        return {
            "categorized": (
                category_source == Transaction.CategorySource.AI
                and obj.is_ai_categorized
            ),
            "confidence": confidence,
            "reason": obj.ai_reason,
            "category_source": category_source,
        }

    def get_merchant(self, obj):
        return {
            "name": obj.merchant_name or obj.description,
            # These fields do not exist in the current Transaction model.
            "location": None,
            "industry": None,
        }

    def get_trend(self, obj):
        if (
            obj.transaction_type != Transaction.TransactionType.EXPENSE
            or not obj.category
        ):
            return None

        current_month_start = obj.date.replace(day=1)

        if current_month_start.month == 1:
            previous_month_start = date(
                current_month_start.year - 1,
                12,
                1,
            )
        else:
            previous_month_start = date(
                current_month_start.year,
                current_month_start.month - 1,
                1,
            )

        previous_month_end = date(
            previous_month_start.year,
            previous_month_start.month,
            monthrange(
                previous_month_start.year,
                previous_month_start.month,
            )[1],
        )

        current_month_end = date(
            current_month_start.year,
            current_month_start.month,
            monthrange(
                current_month_start.year,
                current_month_start.month,
            )[1],
        )

        base_queryset = Transaction.objects.filter(
            user=obj.user,
            category__iexact=obj.category,
            transaction_type=Transaction.TransactionType.EXPENSE,
        )

        current_total = (
            base_queryset.filter(
                date__range=(current_month_start, current_month_end),
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0")
        )

        previous_total = (
            base_queryset.filter(
                date__range=(previous_month_start, previous_month_end),
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0")
        )

        if previous_total == 0:
            percentage_change = None
            direction = "same"
        else:
            difference = current_total - previous_total
            percentage_change = round(
                float((difference / previous_total) * 100),
                2,
            )

            if percentage_change > 0:
                direction = "up"
            elif percentage_change < 0:
                direction = "down"
            else:
                direction = "same"

        return {
            "category": obj.category,
            "current_month_total": current_total,
            "previous_month_total": previous_total,
            "percentage_change": percentage_change,
            "direction": direction,
        }

    def get_optimization_tips(self, obj):
        # Your current database does not contain optimization-tip records.
        # Keep this empty until a real rules or AI service generates them.
        return []