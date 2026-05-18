from decimal import Decimal
from django.shortcuts import get_object_or_404
from .models import Category
from apps.transactions.models import Transaction


def create_category(user, validated_data):
    return Category.objects.create(
        user=user,
        name=validated_data["name"],
        description=validated_data.get("description"),
        category_type=validated_data.get("category_type", "expense"),
        keywords=validated_data.get("keywords"),
    )


def get_user_categories(user):
    return Category.objects.filter(user=user, is_active=True)


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