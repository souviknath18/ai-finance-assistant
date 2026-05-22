from ai_engine.insights.executive_summary import generate_executive_summary
from ai_engine.insights.spending_analysis import (
    get_spending_overview,
    get_category_breakdown,
    get_monthly_spending,
)
from ai_engine.insights.anomaly_detection import detect_anomalies
from ai_engine.insights.recurring_analysis import analyze_recurring_expenses
from ai_engine.insights.financial_health import calculate_financial_health
from ai_engine.insights.wealth_scoring import calculate_wealth_score


def get_insights_summary(user):
    spending = get_spending_overview(user)
    categories = get_category_breakdown(user)
    monthly_spending = get_monthly_spending(user)
    anomalies = detect_anomalies(user)
    recurring = analyze_recurring_expenses(user)
    health = calculate_financial_health(user)
    wealth_score = calculate_wealth_score(user)

    summary = generate_executive_summary(
        spending=spending,
        anomalies=anomalies,
        recurring=recurring,
        health=health,
    )

    top_category = spending.get("top_category")
    biggest_expense = anomalies.get("biggest_expense")

    observations = []

    if top_category:
        observations.append({
            "title": "Highest Spending Category",
            "description": f"{top_category['category']} is your top spending category.",
            "category": top_category["category"],
            "impact": top_category["total_display"],
            "action": "Review",
            "tone": "neutral",
        })

    if biggest_expense:
        observations.append({
            "title": "Largest Expense Detected",
            "description": f"{biggest_expense['merchant']} was your largest expense.",
            "category": biggest_expense["category"],
            "impact": biggest_expense["amount_display"],
            "action": "View",
            "tone": "warning",
        })

    if recurring["duplicates"]:
        duplicate = recurring["duplicates"][0]
        observations.append({
            "title": "Possible Duplicate Services",
            "description": f"You have {duplicate['count']} similar services: {', '.join(duplicate['services'])}.",
            "category": duplicate["group"],
            "impact": "Review",
            "action": "Compare",
            "tone": "saving",
        })

    return {
        "executive_summary": summary,
        "alerts": {
            "budget_warning": {
                "title": anomalies["primary_alert"]["title"],
                "description": anomalies["primary_alert"]["description"],
            },
            "saving_opportunity": {
                "title": "Smart Saving",
                "description": recurring["recommendation"],
            },
        },
        "metrics": {
            "spending_spikes": biggest_expense["amount_display"] if biggest_expense else "₹0.00",
            "spending_spikes_description": (
                f"Unusual activity detected at {biggest_expense['merchant']}."
                if biggest_expense else
                "No major spending spike detected."
            ),
            "unusual_activity_count": anomalies["alert_count"],
            "recurring_total": recurring["monthly_total_display"],
            "recurring_description": recurring["recommendation"],
            "health_score": health["score"],
            "health_status": health["status"],
            "wealth_score": wealth_score["score"],
        },
        "anomalies": anomalies,
        "category_breakdown": categories,
        "monthly_spending": monthly_spending,
        "wealth_tip": {
            "title": f"Financial Health: {health['score']}/100",
            "description": (
                f"Your current financial status is {health['status']} with "
                f"a savings rate of {health['savings_rate']}%."
            ),
            "potential_earn": f"+{wealth_score['score']} Aura Score",
            "potential_description": "based on income, expenses, savings, and recurring payments.",
        },
        "observations": observations,
    }