from ai_engine.insights.financial_health import (
    calculate_financial_health,
)


def calculate_wealth_score(user):
    health = calculate_financial_health(user)

    base_score = health["score"]

    return {
        "score": min(base_score + 5, 100),
        "label": "Aura Wealth Score",
    }