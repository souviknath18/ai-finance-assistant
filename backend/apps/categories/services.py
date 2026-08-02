from decimal import Decimal
from django.shortcuts import get_object_or_404
from .models import Category
from apps.transactions.models import Transaction
from ai_engine.categorization.category_constants import ALLOWED_CATEGORIES
from ai_engine.categorization.category_rules import CATEGORY_RULES
from django.db.models import (
    Case,
    Count,
    DecimalField,
    F,
    Sum,
    Value,
    When,
)
from django.db.models.functions import Coalesce
from django.utils import timezone


def create_category(user, validated_data):
    return Category.objects.create(
        user=user,
        name=validated_data["name"],
        description=validated_data.get("description"),
        category_type=validated_data.get("category_type", "expense"),
        keywords=validated_data.get("keywords"),
    )


def create_default_categories_for_user(user):
    for category_name in ALLOWED_CATEGORIES:
        if category_name == "Uncategorized":
            continue

        Category.objects.get_or_create(
            user=user,
            name=category_name,
            defaults={
                "description": "Default system category.",
                "category_type": "both",
                "keywords": ", ".join(CATEGORY_RULES.get(category_name, [])),
                "is_system": True,
                "is_active": True,
            },
        )


def get_custom_categories(user):
    return Category.objects.filter(
        user=user,
        is_active=True,
        is_system=False,
    ).order_by("name")


def get_category_options(user):
    create_default_categories_for_user(user)

    return Category.objects.filter(
        user=user,
        is_active=True,
    ).order_by("-is_system", "name")


def get_top_category_distribution(
    user,
    limit: int = 5,
):
    """
    Return the user's top expense categories for the latest
    month that contains dated expense transactions.
    """

    safe_limit = min(
        max(int(limit), 1),
        10,
    )

    expense_transactions = Transaction.objects.filter(
        user=user,
        amount__lt=0,
        date__isnull=False,
    )

    latest_transaction = (
        expense_transactions
        .order_by("-date")
        .only("date")
        .first()
    )

    if latest_transaction is None:
        current_month = timezone.localdate().replace(
            day=1
        )

        return {
            "month": current_month.strftime("%Y-%m"),
            "month_label": current_month.strftime("%B %Y"),
            "results": [],
        }

    month_start = latest_transaction.date.replace(
        day=1
    )

    if month_start.month == 12:
        next_month_start = month_start.replace(
            year=month_start.year + 1,
            month=1,
        )
    else:
        next_month_start = month_start.replace(
            month=month_start.month + 1,
        )

    spending_expression = Case(
        When(
            amount__lt=0,
            then=-F("amount"),
        ),
        default=Value(
            Decimal("0.00"),
            output_field=DecimalField(
                max_digits=14,
                decimal_places=2,
            ),
        ),
        output_field=DecimalField(
            max_digits=14,
            decimal_places=2,
        ),
    )

    rows = (
        expense_transactions
        .filter(
            date__gte=month_start,
            date__lt=next_month_start,
        )
        .annotate(
            resolved_category=Coalesce(
                "category",
                Value("Uncategorized"),
            )
        )
        .values(
            "resolved_category"
        )
        .annotate(
            spending=Coalesce(
                Sum(spending_expression),
                Value(
                    Decimal("0.00"),
                    output_field=DecimalField(
                        max_digits=14,
                        decimal_places=2,
                    ),
                ),
            ),
            transactions=Count("id"),
        )
        .filter(
            spending__gt=0
        )
        .order_by(
            "-spending",
            "resolved_category",
        )[:safe_limit]
    )

    return {
        "month": month_start.strftime("%Y-%m"),
        "month_label": month_start.strftime("%B %Y"),
        "results": [
            {
                "name": row["resolved_category"],
                "spending": str(row["spending"]),
                "transactions": row["transactions"],
            }
            for row in rows
        ],
    }


def get_category_summary(user):
    transactions = Transaction.objects.filter(user=user)

    summary = {}

    for transaction in transactions:
        category = transaction.category or "Uncategorized"

        if category not in summary:
            summary[category] = {
                "name": category,
                "transactions": 0,
                "spending": Decimal("0.00"),
                "income": Decimal("0.00"),
                "expense": Decimal("0.00"),
            }

        summary[category]["transactions"] += 1

        amount = transaction.amount or Decimal("0.00")

        if amount < 0:
            summary[category]["expense"] += abs(amount)
            summary[category]["spending"] += abs(amount)
        else:
            summary[category]["income"] += amount

    data = sorted(
        summary.values(),
        key=lambda item: item["spending"],
        reverse=True,
    )

    for item in data:
        item["spending"] = str(item["spending"])
        item["income"] = str(item["income"])
        item["expense"] = str(item["expense"])

    return data


def soft_delete_category(user, category_id):
    category = get_object_or_404(
        Category,
        user=user,
        category_id=category_id,
        is_active=True,
    )

    category.is_active = False
    category.save(update_fields=["is_active", "updated_at"])

    return category