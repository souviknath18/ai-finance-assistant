from langchain.tools import ToolRuntime, tool

from ai.rag.evidence import (
    serialize_evidence_list,
)
from ai.rag.transaction_retriever import (
    retrieve_semantic_transaction_evidence,
)
from ai.tools.langchain.context import (
    AuraToolContext,
)


@tool
def search_transactions(
    query: str,
    runtime: ToolRuntime[AuraToolContext],
    limit: int = 5,
) -> dict:
    """
    Search the authenticated user's transactions semantically.

    Use this when the user describes transactions conceptually
    rather than asking for an exact numerical calculation.

    Good examples include:
    - unnecessary purchases
    - unusual transactions
    - travel-related spending
    - food delivery purchases
    - subscription-like payments
    - similar purchases
    - transactions matching a description

    Do not use this tool for exact totals when a deterministic
    financial calculation tool is available.
    """

    query = query.strip()

    if not query:
        return {
            "query": "",
            "result_count": 0,
            "evidence": [],
        }

    safe_limit = max(
        1,
        min(limit, 10),
    )

    user = runtime.context.user

    evidence = (
        retrieve_semantic_transaction_evidence(
            user=user,
            query=query,
            limit=safe_limit,
        )
    )

    return {
        "query": query,
        "result_count": len(evidence),
        "evidence": serialize_evidence_list(
            evidence
        ),
    }