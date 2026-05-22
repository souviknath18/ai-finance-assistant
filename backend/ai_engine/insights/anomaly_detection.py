from decimal import Decimal

from apps.transactions.models import Transaction
from ai_engine.insights.spending_analysis import money


ANOMALY_THRESHOLD = Decimal("5000.00")


def detect_anomalies(user):
    expenses = Transaction.objects.filter(
        user=user,
        transaction_type="expense",
    )

    biggest = expenses.order_by("amount").first()

    high_value_transactions = expenses.filter(
        amount__lte=-ANOMALY_THRESHOLD,
    ).order_by("amount")[:5]

    alerts = []

    for transaction in high_value_transactions:
        alerts.append({
            "title": "High Value Transaction",
            "description": f"{transaction.merchant_name or transaction.description} on {transaction.date}",
            "amount": str(abs(transaction.amount)),
            "amount_display": money(transaction.amount),
            "category": transaction.category or "Uncategorized",
            "transaction_id": transaction.transaction_id,
        })

    biggest_expense = None

    if biggest:
        biggest_expense = {
            "merchant": biggest.merchant_name or biggest.description,
            "amount": str(abs(biggest.amount)),
            "amount_display": money(biggest.amount),
            "date": biggest.date,
            "category": biggest.category or "Uncategorized",
            "transaction_id": biggest.transaction_id,
        }

    primary_alert = {
        "title": "Spending Watch",
        "description": "No unusual spending detected yet.",
    }

    if biggest_expense:
        primary_alert = {
            "title": "Largest Expense Detected",
            "description": (
                f"{biggest_expense['merchant']} is your largest expense "
                f"at {biggest_expense['amount_display']}."
            ),
        }

    return {
        "biggest_expense": biggest_expense,
        "alerts": alerts,
        "alert_count": len(alerts),
        "primary_alert": primary_alert,
    }