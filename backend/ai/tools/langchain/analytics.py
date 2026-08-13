from datetime import date

from langchain.tools import (
    ToolRuntime,
    tool,
)

from ai.tools.analytics import (
    cash_flow_tool,
    compare_spending_periods_tool,
    monthly_spending_trend_tool,
)
from ai.tools.langchain.context import (
    AuraToolContext,
)


@tool
def compare_spending_periods(
    current_start: date,
    current_end: date,
    previous_start: date,
    previous_end: date,
    runtime: ToolRuntime[AuraToolContext],
) -> dict:
    """
    Compare the user's spending between two periods.

    Use this when the user asks whether spending increased or
    decreased, how this month compares with last month, or how
    two financial periods compare.
    """

    return compare_spending_periods_tool(
        user=runtime.context.user,
        current_start=current_start,
        current_end=current_end,
        previous_start=previous_start,
        previous_end=previous_end,
    )


@tool
def get_cash_flow(
    start_date: date,
    end_date: date,
    runtime: ToolRuntime[AuraToolContext],
) -> dict:
    """
    Calculate income, spending, and net cash flow for a period.

    Use this when the user asks whether they earned more than
    they spent or asks about their cash flow.
    """

    return cash_flow_tool(
        user=runtime.context.user,
        start_date=start_date,
        end_date=end_date,
    )


@tool
def get_monthly_spending_trend(
    start_date: date,
    end_date: date,
    runtime: ToolRuntime[AuraToolContext],
) -> list[dict]:
    """
    Return monthly spending totals over a date range.

    Use this when the user asks about spending trends or how
    their spending has changed across multiple months.
    """

    return monthly_spending_trend_tool(
        user=runtime.context.user,
        start_date=start_date,
        end_date=end_date,
    )