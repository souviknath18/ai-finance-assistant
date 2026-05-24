from decimal import Decimal

from django.db.models import Avg, Count

from apps.transactions.models import Transaction
from ai_engine.insights.spending_analysis import money


ANOMALY_THRESHOLD = Decimal("5000.00")

FIXED_COST_KEYWORDS = [
    "rent",
    "house rent",
    "housing",
    "emi",
    "loan",
    "mortgage",
    "insurance",
    "salary",
    "sip",
    "investment",
    "mutual fund",
    "stocks",
    "stock",
    "zerodha",
    "groww",
    "upstox",
]

FIXED_COST_CATEGORIES = [
    "rent",
    "housing",
    "loan",
    "emi",
    "insurance",
    "investment",
    "investments",
    "mutual fund",
    "sip",
]


def is_fixed_cost(transaction):
    text = f"{transaction.description or ''} {transaction.merchant_name or ''}".lower()
    category = (transaction.category or "").lower()

    if any(keyword in text for keyword in FIXED_COST_KEYWORDS):
        return True

    if any(keyword in category for keyword in FIXED_COST_CATEGORIES):
        return True

    return False


def is_recurring_like(user, transaction):
    merchant = transaction.merchant_name or transaction.description

    if not merchant:
        return False

    similar_count = Transaction.objects.filter(
        user=user,
        transaction_type="expense",
        description__icontains=merchant[:20],
    ).count()

    return similar_count >= 2


def get_unusual_expense_queryset(user):
    return (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
            amount__lte=-ANOMALY_THRESHOLD,
        )
        .order_by("amount")
    )


def detect_anomalies(user):
    expenses = Transaction.objects.filter(
        user=user,
        transaction_type="expense",
    )

    candidate_transactions = get_unusual_expense_queryset(user)

    alerts = []

    for transaction in candidate_transactions:
        if is_fixed_cost(transaction):
            continue

        if is_recurring_like(user, transaction):
            continue

        alerts.append({
            "title": "High Value Transaction",
            "description": f"{transaction.merchant_name or transaction.description} on {transaction.date}",
            "amount": str(abs(transaction.amount)),
            "amount_display": money(transaction.amount),
            "category": transaction.category or "Uncategorized",
            "transaction_id": transaction.transaction_id,
        })

        if len(alerts) >= 5:
            break

    biggest_expense_transaction = None

    for transaction in expenses.order_by("amount"):
        if is_fixed_cost(transaction):
            continue

        if is_recurring_like(user, transaction):
            continue

        biggest_expense_transaction = transaction
        break

    biggest_expense = None

    if biggest_expense_transaction:
        biggest_expense = {
            "merchant": (
                biggest_expense_transaction.merchant_name
                or biggest_expense_transaction.description
            ),
            "amount": str(abs(biggest_expense_transaction.amount)),
            "amount_display": money(biggest_expense_transaction.amount),
            "date": biggest_expense_transaction.date,
            "category": biggest_expense_transaction.category or "Uncategorized",
            "transaction_id": biggest_expense_transaction.transaction_id,
        }

    primary_alert = {
        "title": "Spending Watch",
        "description": "No unusual spending detected yet.",
    }

    if biggest_expense:
        primary_alert = {
            "title": "Largest Unusual Expense Detected",
            "description": (
                f"{biggest_expense['merchant']} looks unusual "
                f"at {biggest_expense['amount_display']}."
            ),
        }

    return {
        "biggest_expense": biggest_expense,
        "alerts": alerts,
        "alert_count": len(alerts),
        "primary_alert": primary_alert,
    }