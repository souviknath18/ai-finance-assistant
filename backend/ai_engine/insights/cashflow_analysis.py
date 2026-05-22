from decimal import Decimal

from ai_engine.insights.spending_analysis import (
    get_total_income,
    get_total_expenses,
)


def calculate_cashflow(user):
    income = get_total_income(user)
    expenses = get_total_expenses(user)

    savings = income - expenses

    return {
        "income": income,
        "expenses": expenses,
        "savings": savings,
    }


def calculate_savings_rate(user):
    data = calculate_cashflow(user)

    income = data["income"]

    if income <= 0:
        return 0

    return round((data["savings"] / income) * 100, 2)


def calculate_burn_rate(user):
    expenses = get_total_expenses(user)

    return round(expenses / 30, 2)