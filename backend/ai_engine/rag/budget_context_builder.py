from apps.budgets.services import get_budget_dashboard


BUDGET_KEYWORDS = [
    "budget",
    "budgets",
    "within budget",
    "staying within budget",
    "over budget",
    "overspending",
    "overspend",
    "spending limit",
    "limit",
    "remaining budget",
    "budget remaining",
    "budget status",
    "critical budget",
    "weekly budget",
    "monthly budget",
]


def is_budget_question(question: str):
    q = question.lower()
    return any(keyword in q for keyword in BUDGET_KEYWORDS)


def build_budget_context(user):
    dashboard = get_budget_dashboard(user)

    summary = dashboard.get("summary", {})
    recommendation = dashboard.get("recommendation", {})
    budgets = dashboard.get("budgets", [])

    if not budgets:
        return {
            "context": """
No active budgets found.

The user has not created any weekly or monthly budgets yet.
You cannot determine whether they are staying within budget.
Suggest creating budgets for categories like Food, Travel, Shopping, Subscriptions, Rent, or Utilities.
""".strip(),
            "sources": [],
        }

    budget_lines = []

    for item in budgets:
        budget_lines.append(
            f"""
Category: {item.get("category")}
Period: {item.get("period")}
Limit: {item.get("limit_display")}
Spent: {item.get("spent_display")}
Remaining: {item.get("remaining_display")}
Usage Percent: {item.get("raw_usage_percent")}%
Status: {item.get("status")}
""".strip()
        )

    critical = [
        item for item in budgets
        if item.get("status") in ["critical", "exceeded"]
    ]

    warning = [
        item for item in budgets
        if item.get("status") == "warning"
    ]

    safe = [
        item for item in budgets
        if item.get("status") == "safe"
    ]

    return {
        "context": f"""
Budget Dashboard Summary:
Total Limit: ₹{summary.get("total_limit", 0)}
Total Spent: ₹{summary.get("total_spent", 0)}
Overall Usage: {summary.get("overall_usage", 0)}%
Active Budgets: {summary.get("active_budgets", 0)}

Budget Recommendation:
Title: {recommendation.get("title")}
Description: {recommendation.get("description")}

Budget Status Counts:
Safe Budgets: {len(safe)}
Warning Budgets: {len(warning)}
Critical or Exceeded Budgets: {len(critical)}

Individual Budgets:
{chr(10).join(budget_lines)}
""".strip(),
        "sources": budgets,
    }