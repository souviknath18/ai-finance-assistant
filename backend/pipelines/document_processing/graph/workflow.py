from langgraph.graph import (
    END,
    START,
    StateGraph,
)

from pipelines.document_processing.graph.nodes import (
    ai_fallback_node,
    ai_repair_node,
    csv_parse_node,
    detect_type_node,
    deterministic_parse_node,
    extract_node,
    finalize_node,
    invoice_enhancement_node,
    normalize_node,
    validate_node,
)
from pipelines.document_processing.graph.routing import (
    route_after_validation,
)
from pipelines.document_processing.graph.state import (
    DocumentProcessingState,
)


# ---------------------------------------------------------------------
# File-type routing
# ---------------------------------------------------------------------

def route_file_type(
    state: DocumentProcessingState,
) -> str:
    file_type = (
        state.get(
            "source_file_type",
            "",
        )
        .strip()
        .lower()
    )

    if file_type == "csv":
        return "csv"

    if file_type in {
        "pdf",
        "image",
    }:
        return "document"

    raise ValueError(
        f"Unsupported file type: {file_type}"
    )


# ---------------------------------------------------------------------
# Post-repair routing
# ---------------------------------------------------------------------

def route_after_repair_validation(
    state: DocumentProcessingState,
) -> str:
    """
    After AI repair we validate again.

    If the repaired result is still too weak,
    run full AI extraction fallback.
    """

    decision = route_after_validation(
        state
    )

    if decision == "ai_fallback":
        return "ai_fallback"

    return "accept"


# ---------------------------------------------------------------------
# Build graph
# ---------------------------------------------------------------------

def build_document_processing_graph():
    graph = StateGraph(
        DocumentProcessingState
    )

    # -------------------------------------------------------------
    # Nodes
    # -------------------------------------------------------------

    graph.add_node(
        "extract",
        extract_node,
    )

    graph.add_node(
        "csv_parse",
        csv_parse_node,
    )

    graph.add_node(
        "normalize",
        normalize_node,
    )

    graph.add_node(
        "detect_type",
        detect_type_node,
    )

    graph.add_node(
        "deterministic_parse",
        deterministic_parse_node,
    )

    graph.add_node(
        "invoice_enhancement",
        invoice_enhancement_node,
    )

    graph.add_node(
        "validate",
        validate_node,
    )

    graph.add_node(
        "ai_repair",
        ai_repair_node,
    )

    graph.add_node(
        "validate_repair",
        validate_node,
    )

    graph.add_node(
        "ai_fallback",
        ai_fallback_node,
    )

    graph.add_node(
        "validate_fallback",
        validate_node,
    )

    graph.add_node(
        "finalize",
        finalize_node,
    )

    # -------------------------------------------------------------
    # START routing
    # -------------------------------------------------------------

    graph.add_conditional_edges(
        START,
        route_file_type,
        {
            "csv": "csv_parse",
            "document": "extract",
        },
    )

    # -------------------------------------------------------------
    # CSV
    # -------------------------------------------------------------

    graph.add_edge(
        "csv_parse",
        "finalize",
    )

    # -------------------------------------------------------------
    # PDF / image
    # -------------------------------------------------------------

    graph.add_edge(
        "extract",
        "normalize",
    )

    graph.add_edge(
        "normalize",
        "detect_type",
    )

    graph.add_edge(
        "detect_type",
        "deterministic_parse",
    )

    graph.add_edge(
        "deterministic_parse",
        "invoice_enhancement",
    )

    graph.add_edge(
        "invoice_enhancement",
        "validate",
    )

    # -------------------------------------------------------------
    # First validation decision
    # -------------------------------------------------------------

    graph.add_conditional_edges(
        "validate",
        route_after_validation,
        {
            "accept": "finalize",
            "ai_repair": "ai_repair",
            "ai_fallback": "ai_fallback",
        },
    )

    # -------------------------------------------------------------
    # Repair path
    # -------------------------------------------------------------

    graph.add_edge(
        "ai_repair",
        "validate_repair",
    )

    graph.add_conditional_edges(
        "validate_repair",
        route_after_repair_validation,
        {
            "accept": "finalize",
            "ai_fallback": "ai_fallback",
        },
    )

    # -------------------------------------------------------------
    # Fallback path
    # -------------------------------------------------------------

    graph.add_edge(
        "ai_fallback",
        "validate_fallback",
    )

    graph.add_edge(
        "validate_fallback",
        "finalize",
    )

    # -------------------------------------------------------------
    # END
    # -------------------------------------------------------------

    graph.add_edge(
        "finalize",
        END,
    )

    return graph.compile()


document_processing_graph = (
    build_document_processing_graph()
)