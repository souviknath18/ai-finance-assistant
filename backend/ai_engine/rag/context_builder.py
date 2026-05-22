from ai_engine.embeddings.semantic_search import semantic_search_transactions


def build_transaction_context(user, user_question: str, n_results: int = 4):
    results = semantic_search_transactions(
        user=user,
        query=user_question,
        n_results=n_results,
    )

    if not results:
        return {
            "context": "No relevant transactions found.",
            "sources": [],
        }

    context_blocks = []

    for item in results:
        metadata = item.get("metadata", {})

        context_blocks.append(
            f"""
Date: {metadata.get("date")}
Merchant: {metadata.get("merchant")}
Description: {metadata.get("description")}
Category: {metadata.get("category")}
Type: {metadata.get("transaction_type")}
Amount: ₹{metadata.get("amount")}
Transaction ID: {metadata.get("transaction_id")}
""".strip()
        )

    return {
        "context": "\n\n---\n\n".join(context_blocks),
        "sources": results,
    }