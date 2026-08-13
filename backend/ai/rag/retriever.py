from ai.rag.schemas import (
    RetrievalFilters,
    RetrievalResult,
)
from ai.rag.structured_retriever import (
    retrieve_structured_transactions,
)
from ai.rag.transaction_retriever import (
    retrieve_semantic_transaction_evidence,
)


def retrieve_financial_context(
    *,
    user,
    query: str,
    filters: RetrievalFilters | None = None,
    use_semantic: bool = True,
    use_structured: bool = False,
    semantic_limit: int = 5,
    structured_limit: int = 20,
) -> RetrievalResult:
    """
    Shared financial retrieval entry point.

    This function deliberately supports both:
    - semantic retrieval via pgvector
    - deterministic retrieval via PostgreSQL filters
    """

    evidence = []

    if use_structured:
        evidence.extend(
            retrieve_structured_transactions(
                user=user,
                filters=filters,
                limit=structured_limit,
            )
        )

    if use_semantic and query.strip():
        evidence.extend(
            retrieve_semantic_transaction_evidence(
                user=user,
                query=query,
                limit=semantic_limit,
            )
        )

    evidence = _deduplicate_evidence(
        evidence
    )

    return RetrievalResult(
        query=query,
        evidence=evidence,
        metadata={
            "semantic_used": use_semantic,
            "structured_used": use_structured,
            "result_count": len(evidence),
        },
    )


def _deduplicate_evidence(
    evidence,
):
    """
    Remove duplicated evidence when the same transaction
    is returned by SQL and semantic retrieval.
    """

    seen = set()
    unique = []

    for item in evidence:
        key = (
            item.source_type,
            item.source_id,
        )

        if key in seen:
            continue

        seen.add(key)
        unique.append(item)

    return unique