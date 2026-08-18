from pipelines.document_processing.validation.parser_validator import (
    should_use_ai_fallback,
    should_use_ai_repair,
)


def route_after_validation(
    state,
) -> str:
    parser_result = state.get(
        "parser_result",
        {},
    )

    validation_result = state.get(
        "validation_result",
        {},
    )

    if should_use_ai_fallback(
        parser_result,
        validation_result,
    ):
        return "ai_fallback"

    if should_use_ai_repair(
        parser_result,
        validation_result,
    ):
        return "ai_repair"

    return "accept"