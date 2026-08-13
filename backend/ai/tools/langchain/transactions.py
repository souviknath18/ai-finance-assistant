from datetime import date

from langchain.tools import ToolRuntime, tool

from ai.tools.langchain.context import AuraToolContext
from ai.tools.transactions import (
    category_breakdown_tool,
    category_spending_tool,
    largest_expense_tool,
    top_spending_category_tool,
    total_income_tool,
    total_spending_tool,
    transaction_counts_tool,
)


@tool
def get_total_spending(
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Get the authenticated user's total spending for a date range.

    Use this when the user asks how much they spent overall during
    a specific period.
    """

    user = runtime.context.user

    return total_spending_tool(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )


@tool
def get_total_income(
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Get the authenticated user's total income for a date range.

    Use this when the user asks about salary, deposits, income,
    earnings, or total incoming money.
    """

    user = runtime.context.user

    return total_income_tool(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )


@tool
def get_category_spending(
    category: str,
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Get spending for a particular transaction category.

    Use this when the user asks how much they spent on categories
    such as Food, Travel, Shopping, Transport, Subscriptions,
    Entertainment, or Groceries.
    """

    user = runtime.context.user

    return category_spending_tool(
        user=user,
        category=category,
        start_date=start_date,
        end_date=end_date,
    )


@tool
def get_category_breakdown(
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int = 10,
) -> list[dict]:
    """
    Get spending grouped by category.

    Use this when the user wants to understand where their money
    went or compare their largest spending categories.
    """

    user = runtime.context.user

    return category_breakdown_tool(
        user=user,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
    )


@tool
def get_top_spending_category(
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict | None:
    """
    Get the user's highest-spending category for a date range.

    Use this when the user asks where they spent the most money.
    """

    user = runtime.context.user

    return top_spending_category_tool(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )


@tool
def get_largest_expense(
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict | None:
    """
    Get the user's largest individual expense.

    Use this when the user asks about their biggest transaction
    or largest expense.
    """

    user = runtime.context.user

    return largest_expense_tool(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )


@tool
def get_transaction_counts(
    runtime: ToolRuntime[AuraToolContext],
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Count the authenticated user's transactions by transaction type.

    Use this when the user asks how many transactions, expenses,
    income transactions, or transfers they have.
    """

    user = runtime.context.user

    return transaction_counts_tool(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )