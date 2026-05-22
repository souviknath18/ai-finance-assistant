from .models import Budget
from ai_engine.insights.budget_analysis import (
    analyze_budget_usage,
    generate_budget_recommendation,
)


def get_budget_dashboard(user):
    budgets = Budget.objects.filter(user=user, is_active=True)

    budget_items = [
        analyze_budget_usage(user, budget)
        for budget in budgets
    ]

    total_limit = sum(float(item["limit_amount"]) for item in budget_items)
    total_spent = sum(float(item["spent_amount"]) for item in budget_items)

    overall_usage = 0
    if total_limit > 0:
        overall_usage = round((total_spent / total_limit) * 100, 2)

    return {
        "summary": {
            "total_limit": total_limit,
            "total_spent": total_spent,
            "overall_usage": min(overall_usage, 100),
            "active_budgets": len(budget_items),
        },
        "recommendation": generate_budget_recommendation(budget_items),
        "budgets": budget_items,
    }