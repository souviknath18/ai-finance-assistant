from ai.rag.schemas import RetrievedEvidence


def serialize_evidence(
    evidence: RetrievedEvidence,
) -> dict:
    return {
        "source_type": evidence.source_type,
        "source_id": evidence.source_id,
        "content": evidence.content,
        "metadata": evidence.metadata,
        "score": evidence.score,
    }


def serialize_evidence_list(
    evidence: list[RetrievedEvidence],
) -> list[dict]:
    return [
        serialize_evidence(item)
        for item in evidence
    ]