from ai.rag.schemas import RetrievalResult


def build_context_text(
    result: RetrievalResult,
) -> str:
    """
    Convert structured retrieval evidence into LLM-ready context.
    """

    if not result.evidence:
        return "No relevant financial evidence found."

    blocks = []

    for index, item in enumerate(
        result.evidence,
        start=1,
    ):
        blocks.append(
            (
                f"[Evidence {index}]\n"
                f"Source Type: {item.source_type}\n"
                f"Source ID: {item.source_id}\n"
                f"{item.content}"
            )
        )

    return "\n\n---\n\n".join(
        blocks
    )