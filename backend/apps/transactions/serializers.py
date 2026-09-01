from calendar import monthrange
from datetime import date
from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    uploaded_file_name = serializers.SerializerMethodField()
    bank_connection_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction

        fields = [
            "id",
            "transaction_id",

            # Transaction source
            "source",

            # Upload source
            "uploaded_file",
            "uploaded_file_name",

            # Bank source
            "bank_connection",
            "bank_connection_name",

            # Provider transaction identifier
            "external_transaction_id",

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
            "parser_confidence",
            "parser_used",
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

            # These must be controlled by backend services
            "source",
            "uploaded_file",
            "bank_connection",
            "external_transaction_id",

            "parser_confidence",
            "parser_used",
            "created_at",
            "updated_at",
        ]

    def get_uploaded_file_name(self, obj):
        if obj.uploaded_file:
            return obj.uploaded_file.original_filename

        return None

    def get_bank_connection_name(self, obj):
        if not obj.bank_connection:
            return None

        return (
            f"{obj.bank_connection.institution_name} "
            f"••••{obj.bank_connection.masked_account_number}"
        )


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

    # Extra information describing where
    # the transaction came from.
    #
    # We intentionally call this source_details
    # instead of source because "source" already
    # exists on TransactionSerializer.
    source_details = serializers.SerializerMethodField()

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
            "source_details",
            "previous_payments",
            "ai",
            "merchant",
            "trend",
            "optimization_tips",
        ]

    # --------------------------------------------------
    # Review status
    # --------------------------------------------------

    def get_review_needed(self, obj):
        if (
            not obj.category
            or obj.category == "Uncategorized"
            or obj.category_source
            == Transaction.CategorySource.NONE
        ):
            return True

        if (
            obj.category_source
            == Transaction.CategorySource.AI
            and obj.ai_confidence is not None
            and obj.ai_confidence < Decimal("0.85")
        ):
            return True

        return False

    # --------------------------------------------------
    # Transaction status
    # --------------------------------------------------

    def get_status(self, obj):
        if self.get_review_needed(obj):
            return "AI Review Needed"

        if (
            obj.category_source
            == Transaction.CategorySource.AI
        ):
            return "AI Verified"

        if (
            obj.category_source
            == Transaction.CategorySource.RULE
        ):
            return "Rule Verified"

        if (
            obj.category_source
            == Transaction.CategorySource.USER
        ):
            return "User Verified"

        return "Manual"

    # --------------------------------------------------
    # Similar / recurring transaction helpers
    # --------------------------------------------------

    def _matching_transactions(self, obj):
        queryset = Transaction.objects.filter(
            user=obj.user,
        ).exclude(
            pk=obj.pk,
        )

        if obj.merchant_name:
            return queryset.filter(
                merchant_name__iexact=obj.merchant_name,
            )

        return queryset.filter(
            description__iexact=obj.description,
        )

    def get_is_recurring(self, obj):
        """
        Initial recurring-payment inference.

        If another transaction exists with the
        same merchant or description, mark it
        as potentially recurring.

        Later this can be replaced with more
        strict interval-based recurring detection.
        """

        return self._matching_transactions(
            obj
        ).exists()

    # --------------------------------------------------
    # Transaction source details
    # --------------------------------------------------

    def get_source_details(self, obj):
        """
        Return additional metadata describing
        where the transaction originated.

        The base "source" field still returns:

        upload
        bank_sync
        manual
        csv_import
        """

        # ----------------------------------------------
        # Bank synchronized transaction
        # ----------------------------------------------

        if (
            obj.source
            == Transaction.TransactionSource.BANK_SYNC
        ):
            if not obj.bank_connection:
                return {
                    "type": "bank_sync",
                    "bank_connection_id": None,
                    "institution_name": None,
                    "account_name": None,
                    "masked_account_number": None,
                    "external_transaction_id": (
                        obj.external_transaction_id
                    ),
                }

            return {
                "type": "bank_sync",

                "bank_connection_id": str(
                    obj.bank_connection.id
                ),

                "institution_name": (
                    obj.bank_connection.institution_name
                ),

                "account_name": (
                    obj.bank_connection.account_name
                ),

                "masked_account_number": (
                    obj.bank_connection.masked_account_number
                ),

                "external_transaction_id": (
                    obj.external_transaction_id
                ),
            }

        # ----------------------------------------------
        # Uploaded statement transaction
        # ----------------------------------------------

        if (
            obj.source
            == Transaction.TransactionSource.UPLOAD
        ):
            uploaded_file = obj.uploaded_file

            if not uploaded_file:
                return {
                    "type": "upload",
                    "id": None,
                    "upload_id": None,
                    "filename": None,
                    "file_type": None,
                    "uploaded_at": None,
                    "processed_at": None,
                }

            return {
                "type": "upload",

                "id": uploaded_file.pk,

                "upload_id": getattr(
                    uploaded_file,
                    "upload_id",
                    None,
                ),

                "filename": (
                    uploaded_file.original_filename
                ),

                "file_type": (
                    uploaded_file.file_type
                ),

                "uploaded_at": getattr(
                    uploaded_file,
                    "created_at",
                    None,
                ),

                "processed_at": getattr(
                    uploaded_file,
                    "processed_at",
                    None,
                ),
            }

        # ----------------------------------------------
        # CSV import
        # ----------------------------------------------

        if (
            obj.source
            == Transaction.TransactionSource.CSV_IMPORT
        ):
            uploaded_file = obj.uploaded_file

            return {
                "type": "csv_import",

                "id": (
                    uploaded_file.pk
                    if uploaded_file
                    else None
                ),

                "upload_id": (
                    getattr(
                        uploaded_file,
                        "upload_id",
                        None,
                    )
                    if uploaded_file
                    else None
                ),

                "filename": (
                    uploaded_file.original_filename
                    if uploaded_file
                    else None
                ),
            }

        # ----------------------------------------------
        # Manual transaction
        # ----------------------------------------------

        return {
            "type": "manual",
        }

    # --------------------------------------------------
    # Previous payments
    # --------------------------------------------------

    def get_previous_payments(self, obj):
        transactions = (
            self._matching_transactions(obj)
            .select_related(
                "uploaded_file",
                "bank_connection",
            )
            .order_by(
                "-date",
                "-created_at",
            )[:5]
        )

        return [
            {
                "transaction_id": (
                    transaction.transaction_id
                ),

                "date": (
                    transaction.date
                ),

                "date_is_estimated": (
                    transaction.date_is_estimated
                ),

                "description": (
                    transaction.description
                ),

                "merchant_name": (
                    transaction.merchant_name
                ),

                "amount": (
                    transaction.amount
                ),

                "transaction_type": (
                    transaction.transaction_type
                ),

                "category": (
                    transaction.category
                ),

                "status": (
                    self.get_status(
                        transaction
                    )
                ),

                "source": (
                    transaction.source
                ),
            }

            for transaction in transactions
        ]

    # --------------------------------------------------
    # AI details
    # --------------------------------------------------

    def get_ai(self, obj):
        category_source = obj.category_source

        if (
            category_source
            == Transaction.CategorySource.NONE
            and obj.ai_confidence is None
            and not obj.ai_reason
        ):
            return None

        confidence = (
            obj.ai_confidence
            if (
                category_source
                == Transaction.CategorySource.AI
            )
            else None
        )

        return {
            "categorized": (
                category_source
                == Transaction.CategorySource.AI
                and obj.is_ai_categorized
            ),

            "confidence": confidence,

            "reason": (
                obj.ai_reason
            ),

            "category_source": (
                category_source
            ),
        }

    # --------------------------------------------------
    # Merchant details
    # --------------------------------------------------

    def get_merchant(self, obj):
        return {
            "name": (
                obj.merchant_name
                or obj.description
            ),

            # These fields currently do not exist
            # on the Transaction model.
            "location": None,
            "industry": None,
        }

    # --------------------------------------------------
    # Spending trend
    # --------------------------------------------------

    def get_trend(self, obj):
        if (
            obj.date is None
            or obj.transaction_type
            != Transaction.TransactionType.EXPENSE
            or not obj.category
        ):
            return None

        current_month_start = obj.date.replace(
            day=1
        )

        # Previous month
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
            transaction_type=(
                Transaction.TransactionType.EXPENSE
            ),
        )

        current_total = (
            base_queryset.filter(
                date__range=(
                    current_month_start,
                    current_month_end,
                ),
            ).aggregate(
                total=Sum("amount")
            )["total"]
            or Decimal("0")
        )

        previous_total = (
            base_queryset.filter(
                date__range=(
                    previous_month_start,
                    previous_month_end,
                ),
            ).aggregate(
                total=Sum("amount")
            )["total"]
            or Decimal("0")
        )

        if previous_total == 0:
            percentage_change = None
            direction = "same"

        else:
            difference = (
                current_total
                - previous_total
            )

            percentage_change = round(
                float(
                    (
                        difference
                        / previous_total
                    )
                    * 100
                ),
                2,
            )

            if percentage_change > 0:
                direction = "up"

            elif percentage_change < 0:
                direction = "down"

            else:
                direction = "same"

        return {
            "category": (
                obj.category
            ),

            "current_month_total": (
                current_total
            ),

            "previous_month_total": (
                previous_total
            ),

            "percentage_change": (
                percentage_change
            ),

            "direction": (
                direction
            ),
        }

    # --------------------------------------------------
    # Optimization tips
    # --------------------------------------------------

    def get_optimization_tips(self, obj):
        """
        There are currently no persisted
        optimization-tip records.

        This can later be replaced with an
        AI/rules-based optimization service.
        """

        return []