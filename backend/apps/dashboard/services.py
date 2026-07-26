from decimal import Decimal, InvalidOperation

from django.db.models import Sum
from django.db.models.functions import TruncMonth

from apps.transactions.models import Transaction, TransactionEmbedding
from apps.uploads.models import UploadedFile
from apps.subscriptions.models import Subscription
from apps.budgets.services import get_budget_dashboard


def money(value):
    if value is None:
        value = Decimal("0.00")

    if isinstance(value, str):
        try:
            value = Decimal(value)
        except InvalidOperation:
            value = Decimal("0.00")

    return f"₹{abs(value):,.2f}"


def get_dashboard_data(user):
    transactions = Transaction.objects.filter(user=user)

    income = (
        transactions.filter(transaction_type="income").aggregate(total=Sum("amount"))[
            "total"
        ]
        or Decimal("0.00")
    )

    expenses = (
        transactions.filter(transaction_type="expense").aggregate(total=Sum("amount"))[
            "total"
        ]
        or Decimal("0.00")
    )

    income = abs(income)
    expenses = abs(expenses)
    balance = income - expenses
    savings = balance

    monthly = (
        transactions.annotate(month=TruncMonth("date"))
        .values("month", "transaction_type")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    chart_map = {}

    for item in monthly:
        if not item["month"]:
            continue

        month = item["month"].strftime("%b")

        if month not in chart_map:
            chart_map[month] = {
                "month": month,
                "income": 0,
                "expense": 0,
            }

        if item["transaction_type"] == "income":
            chart_map[month]["income"] = float(abs(item["total"] or 0))

        if item["transaction_type"] == "expense":
            chart_map[month]["expense"] = float(abs(item["total"] or 0))

    chart = list(chart_map.values())[-6:]

    top_spending = (
        transactions.filter(transaction_type="expense")
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("total")
    )

    top_spending_data = [
        {
            "label": item["category"] or "Uncategorized",
            "amount": money(item["total"]),
            "total": float(abs(item["total"] or 0)),
        }
        for item in top_spending
    ]

    recent = transactions.order_by(
        "-date",
        "-created_at",
    )[:5]

    recent_transactions = []

    for tx in recent:
        description = (
            tx.description
            or tx.merchant_name
            or "Unknown Transaction"
        )

        if " - " in description:
            description = description.split(
                " - ",
                1,
            )[0].strip()

        recent_transactions.append(
            {
                "id": tx.transaction_id,
                "date": (
                    tx.date.strftime("%b %d, %Y")
                    if tx.date
                    else "Unknown date"
                ),
                "description": description,
                "category": (
                    tx.category
                    or "Uncategorized"
                ),
                "amount": (
                    f"+{money(tx.amount)}"
                    if tx.transaction_type == "income"
                    else f"-{money(tx.amount)}"
                ),
                "type": tx.transaction_type,
            }
        )

    uploads_queryset = UploadedFile.objects.filter(user=user)

    recent_uploads_queryset = uploads_queryset.order_by(
        "-uploaded_at"
    )[:4]

    recent_uploads_total = uploads_queryset.count()

    recent_uploads = []

    for file in recent_uploads_queryset:
        if file.status in [
            UploadedFile.Status.SUCCESS,
            UploadedFile.Status.FAILED,
        ]:
            progress = 100
        else:
            progress = file.processing_progress

        size = (
            f"{round(file.file_size / (1024 * 1024), 2)} MB"
            if file.file_size >= 1024 * 1024
            else f"{round(file.file_size / 1024, 1)} KB"
        )

        recent_uploads.append(
            {
                "id": file.id,
                "name": file.original_filename,
                "size": size,
                "status": file.status,
                "progress": progress,
            }
        )

    subscriptions_queryset = (
        Subscription.objects.filter(user=user, is_active=True)
        .order_by("next_billing_date", "-updated_at")[:2]
    )

    subscriptions_data = [
        {
            "id": item.id,
            "name": item.merchant,
            "price": money(item.amount),
            "nextBilling": (
                item.next_billing_date.strftime("%b %d")
                if item.next_billing_date
                else "Not set"
            ),
        }
        for item in subscriptions_queryset
    ]

    monthly_subscription_total = sum(
        abs(item.amount) for item in subscriptions_queryset
    )

    budget_dashboard = get_budget_dashboard(user)
    budget_preview_items = budget_dashboard.get("budgets", [])[:3]

    budgets_data = []

    for item in budget_preview_items:
        percent = float(item.get("usage_percentage", 0))

        budgets_data.append(
            {
                "label": item.get("category", "Uncategorized"),
                "used": money(item.get("spent_amount", 0)),
                "limit": money(item.get("limit_amount", 0)),
                "percent": min(round(percent, 1), 100),
                "overLimit": percent > 100,
                "note": (
                    f"Over limit by {round(percent - 100, 1)}%"
                    if percent > 100
                    else None
                ),
            }
        )

    healthy_count = len([item for item in budgets_data if not item["overLimit"]])

    budget_recommendation = budget_dashboard.get(
        "recommendation",
        "Aura will monitor your budgets once you add spending limits.",
    )

    semantic_preview_queryset = (
        TransactionEmbedding.objects.filter(user=user)
        .select_related("transaction")
        .order_by("-updated_at")[:3]
    )

    semantic_preview = []

    for item in semantic_preview_queryset:
        tx = item.transaction

        semantic_preview.append(
            {
                "id": str(tx.transaction_id),
                "merchant": (
                    tx.merchant_name
                    or tx.description
                    or "Unknown Transaction"
                ),
                "amount": money(tx.amount),
                "category": tx.category or "Uncategorized",
                "similarity": "Indexed",
            }
        )

    return {
        "metrics": {
            "balance": money(balance),
            "income": money(income),
            "expenses": money(expenses),
            "savings": money(savings),
        },
        "chart": chart,
        "ai_insights": [
            {
                "title": "Spending Summary",
                "description": f"You spent {money(expenses)} across your uploaded transactions.",
            },
            {
                "title": "Savings Insight",
                "description": f"Your current calculated savings is {money(savings)}.",
            },
        ],
        "top_spending": top_spending_data,
        "recent_transactions": recent_transactions,
        "recent_uploads": recent_uploads,
        "recent_uploads_total": recent_uploads_total,
        "subscriptions": subscriptions_data,
        "subscriptions_monthly_total": money(monthly_subscription_total),
        "budgets": budgets_data,
        "budget_healthy_count": healthy_count,
        "budget_recommendation": budget_recommendation,
        "semantic_preview": semantic_preview,
        "semantic_preview_query": "Show similar transactions using AI search",
    }