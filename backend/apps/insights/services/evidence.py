from ai.rag.transaction_retriever import (
    retrieve_semantic_transaction_evidence,
)
from ai.rag.evidence import (
    serialize_evidence_list,
)


def get_insight_evidence(
    *,
    user,
    query: str,
    limit: int = 8,
) -> list[dict]:
    """
    Retrieve supporting transaction evidence for an insight topic.
    """

    evidence = retrieve_semantic_transaction_evidence(
        user=user,
        query=query,
        limit=limit,
    )

    return serialize_evidence_list(
        evidence
    )