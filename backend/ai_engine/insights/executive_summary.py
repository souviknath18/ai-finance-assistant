def generate_executive_summary(spending, anomalies, recurring, health):
    transaction_count = spending["transaction_count"]

    return {
        "title": "AI Financial Summary",
        "headline": (
            f"Aura analyzed {transaction_count} transactions. "
            f"Your financial health score is {health['score']}/100."
        ),
        "description": (
            f"Your total spending is {spending['total_expense_display']} and "
            f"your total income is {spending['total_income_display']}. "
            f"Recurring payments total around {recurring['monthly_total_display']}. "
            f"{anomalies['alert_count']} unusual spending alert"
            f"{'s' if anomalies['alert_count'] != 1 else ''} detected."
        ),
    }