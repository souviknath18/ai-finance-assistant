from dataclasses import dataclass, field
from datetime import date
from typing import Any


@dataclass
class RetrievalFilters:
    start_date: date | None = None
    end_date: date | None = None

    category: str | None = None
    merchant: str | None = None
    transaction_type: str | None = None

    min_amount: float | None = None
    max_amount: float | None = None


@dataclass
class RetrievedEvidence:
    source_type: str
    source_id: str

    content: str

    metadata: dict[str, Any] = field(
        default_factory=dict
    )

    score: float | None = None


@dataclass
class RetrievalResult:
    query: str

    evidence: list[RetrievedEvidence] = field(
        default_factory=list
    )

    metadata: dict[str, Any] = field(
        default_factory=dict
    )

    @property
    def has_evidence(self) -> bool:
        return bool(self.evidence)