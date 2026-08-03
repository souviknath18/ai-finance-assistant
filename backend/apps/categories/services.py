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
from django.db import transaction
from rest_framework.exceptions import ValidationError


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
    create_default_categories_for_user(user)

    transactions = Transaction.objects.filter(
        user=user
    )

    active_categories = Category.objects.filter(
        user=user,
        is_active=True,
    )

    category_lookup = {
        category.name.strip().lower(): {
            "category_id": category.category_id,
            "is_system": category.is_system,
        }
        for category in active_categories
    }

    summary = {}

    for transaction in transactions:
        category_name = (
            transaction.category
            or "Uncategorized"
        ).strip()

        lookup_key = category_name.lower()

        category_record = category_lookup.get(
            lookup_key
        )

        if category_name not in summary:
            summary[category_name] = {
                "category_id": (
                    category_record[
                        "category_id"
                    ]
                    if category_record
                    else None
                ),
                "is_system": (
                    category_record[
                        "is_system"
                    ]
                    if category_record
                    else False
                ),
                "name": category_name,
                "transactions": 0,
                "spending": Decimal("0.00"),
                "income": Decimal("0.00"),
                "expense": Decimal("0.00"),
            }

        summary[
            category_name
        ]["transactions"] += 1

        amount = (
            transaction.amount
            or Decimal("0.00")
        )

        if amount < 0:
            expense_amount = abs(amount)

            summary[
                category_name
            ]["expense"] += expense_amount

            summary[
                category_name
            ]["spending"] += expense_amount
        else:
            summary[
                category_name
            ]["income"] += amount

    data = sorted(
        summary.values(),
        key=lambda item: item["spending"],
        reverse=True,
    )

    for item in data:
        item["spending"] = str(
            item["spending"]
        )
        item["income"] = str(
            item["income"]
        )
        item["expense"] = str(
            item["expense"]
        )

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


def merge_category_keywords(
    destination_keywords: str | None,
    source_keywords: str | None,
) -> str | None:
    unique_keywords: dict[str, str] = {}

    for keyword_text in (
        destination_keywords,
        source_keywords,
    ):
        for keyword in str(
            keyword_text or ""
        ).split(","):
            cleaned_keyword = keyword.strip()

            if not cleaned_keyword:
                continue

            unique_keywords.setdefault(
                cleaned_keyword.lower(),
                cleaned_keyword,
            )

    if not unique_keywords:
        return None

    return ", ".join(
        unique_keywords.values()
    )


@transaction.atomic
def merge_categories(
    *,
    user,
    source_category_id: str,
    destination_category_id: str,
):
    source_category = get_object_or_404(
        Category.objects.select_for_update(),
        user=user,
        category_id=source_category_id,
        is_active=True,
    )

    destination_category = get_object_or_404(
        Category.objects.select_for_update(),
        user=user,
        category_id=destination_category_id,
        is_active=True,
    )

    if source_category.id == destination_category.id:
        raise ValidationError(
            {
                "destination_category_id": (
                    "A category cannot be merged into itself."
                )
            }
        )

    if source_category.is_system:
        raise ValidationError(
            {
                "source_category_id": (
                    "System categories cannot be merged."
                )
            }
        )

    updated_transactions = (
        Transaction.objects.filter(
            user=user,
            category__iexact=source_category.name,
        )
        .update(
            category=destination_category.name
        )
    )

    merged_keywords = merge_category_keywords(
        destination_category.keywords,
        source_category.keywords,
    )

    destination_category.keywords = merged_keywords

    destination_category.save(
        update_fields=[
            "keywords",
            "updated_at",
        ]
    )

    source_category.is_active = False

    source_category.save(
        update_fields=[
            "is_active",
            "updated_at",
        ]
    )

    return {
        "source_category": {
            "category_id": source_category.category_id,
            "name": source_category.name,
        },
        "destination_category": {
            "category_id": destination_category.category_id,
            "name": destination_category.name,
        },
        "updated_transactions": updated_transactions,
    }


@transaction.atomic
def update_category(
    *,
    category,
    validated_data,
):
    old_name = category.name

    for field, value in validated_data.items():
        setattr(
            category,
            field,
            value,
        )

    category.save()

    if old_name.lower() != category.name.lower():
        Transaction.objects.filter(
            user=category.user,
            category__iexact=old_name,
        ).update(
            category=category.name
        )

    return category