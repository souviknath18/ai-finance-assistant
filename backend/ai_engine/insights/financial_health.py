from ai_engine.insights.cashflow_analysis import (
    calculate_savings_rate,
)


def calculate_financial_health(user):
    savings_rate = calculate_savings_rate(user)

    if savings_rate >= 40:
        score = 90
        status = "Excellent"

    elif savings_rate >= 25:
        score = 75
        status = "Healthy"

    elif savings_rate >= 10:
        score = 55
        status = "Needs Attention"

    else:
        score = 35
        status = "Critical"

    return {
        "score": score,
        "status": status,
        "savings_rate": savings_rate,
    }