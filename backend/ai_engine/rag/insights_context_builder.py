from apps.insights.services import get_insights_summary


INSIGHT_KEYWORDS = [
    "insight",
    "summary",
    "health score",
    "financial health",
    "wealth score",
    "aura score",
    "recurring",
    "subscription",
    "unusual",
    "anomaly",
    "alert",
    "saving opportunity",
    "spending spike",
    "budget warning",
    "cashflow",
    "cash flow",
]


def is_insights_question(question: str):
    q = question.lower()

    return any(keyword in q for keyword in INSIGHT_KEYWORDS)


def build_insights_context(user):
    insights = get_insights_summary(user)

    summary = insights.get("executive_summary", {})
    metrics = insights.get("metrics", {})
    alerts = insights.get("alerts", {})
    wealth_tip = insights.get("wealth_tip", {})
    observations = insights.get("observations", [])

    observation_lines = []

    for item in observations[:5]:
        observation_lines.append(
            f"""
Title: {item.get("title")}
Description: {item.get("description")}
Category: {item.get("category")}
Impact: {item.get("impact")}
Action: {item.get("action")}
""".strip()
        )

    return {
        "context": f"""
Executive Summary:
Title: {summary.get("title")}
Headline: {summary.get("headline")}
Description: {summary.get("description")}

Key Metrics:
Spending Spikes: {metrics.get("spending_spikes")}
Unusual Activity Count: {metrics.get("unusual_activity_count")}
Recurring Total: {metrics.get("recurring_total")}
Health Score: {metrics.get("health_score")}
Health Status: {metrics.get("health_status")}
Wealth Score: {metrics.get("wealth_score")}

Budget Warning:
Title: {alerts.get("budget_warning", {}).get("title")}
Description: {alerts.get("budget_warning", {}).get("description")}

Saving Opportunity:
Title: {alerts.get("saving_opportunity", {}).get("title")}
Description: {alerts.get("saving_opportunity", {}).get("description")}

Wealth Tip:
Title: {wealth_tip.get("title")}
Description: {wealth_tip.get("description")}
Potential: {wealth_tip.get("potential_earn")}
Potential Description: {wealth_tip.get("potential_description")}

Recent Observations:
{chr(10).join(observation_lines) if observation_lines else "No observations available."}
""".strip(),
        "sources": [insights],
    }