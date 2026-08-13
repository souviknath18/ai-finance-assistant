from typing import Literal

from pydantic import BaseModel, Field


class GeneratedInsight(BaseModel):
    title: str

    description: str

    category: str | None = None

    tone: Literal[
        "positive",
        "warning",
        "critical",
        "info",
    ] = "info"

    recommendation: str | None = None


class GeneratedInsightsResponse(BaseModel):
    executive_summary: str = Field(
        description=(
            "Short overall summary of the user's "
            "financial situation for the period."
        )
    )

    insights: list[GeneratedInsight] = Field(
        default_factory=list
    )