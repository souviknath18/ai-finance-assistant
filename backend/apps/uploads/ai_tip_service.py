import json
import logging

from django.utils import timezone
from pydantic import BaseModel, Field

from ai.llm.langchain_client import (
    get_aura_chat_model,
)

from apps.insights.services.analytics_service import (
    build_period_analytics,
    get_current_month_period,
)
from apps.insights.services.recurring_detector import (
    analyze_recurring_expenses,
)
from apps.transactions.models import Transaction
from apps.uploads.models import UploadedFile


logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------
# Structured AI output
# ---------------------------------------------------------------------

class UploadTipOutput(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=220,
    )


# ---------------------------------------------------------------------
# Immediate deterministic Uploads-page tip
# ---------------------------------------------------------------------

def generate_upload_ai_tip(user):
    """
    Return an immediate deterministic tip based on upload state.

    This function does NOT call the LLM.

    It is useful for states such as:
    - no uploads
    - processing
    - failed upload
    - successful extraction
    """

    files = (
        UploadedFile.objects
        .filter(user=user)
        .order_by("-uploaded_at")
    )

    total_files = files.count()

    successful_files = (
        files.filter(
            status=UploadedFile.Status.SUCCESS,
        ).count()
    )

    failed_files = (
        files.filter(
            status=UploadedFile.Status.FAILED,
        ).count()
    )

    processing_files = (
        files.filter(
            status=UploadedFile.Status.PROCESSING,
        ).count()
    )

    latest_file = files.first()

    if total_files == 0:
        return {
            "message": (
                "Upload your first bank statement, CSV, "
                "or invoice so Aura can start generating "
                "personalized financial insights."
            ),
            "action_label": "Upload File",
            "source": "rule",
        }

    if processing_files > 0:
        return {
            "message": (
                "Aura is currently analyzing your latest "
                "upload. Your parsed transactions and "
                "insights will appear once processing "
                "is complete."
            ),
            "action_label": "View Progress",
            "source": "rule",
        }

    if (
        failed_files > 0
        and latest_file
        and latest_file.status
        == UploadedFile.Status.FAILED
    ):
        return {
            "message": (
                "Your latest file could not be processed. "
                "Try uploading a clearer PDF or a properly "
                "formatted CSV for better extraction accuracy."
            ),
            "action_label": "Retry Upload",
            "source": "rule",
        }

    if (
        latest_file
        and latest_file.extracted_transactions_count > 0
    ):
        return {
            "message": (
                f"Aura extracted "
                f"{latest_file.extracted_transactions_count} "
                "transactions from your latest upload. "
                "Review them to improve category accuracy."
            ),
            "action_label": "Review Results",
            "source": "rule",
        }

    if successful_files >= 3:
        return {
            "message": (
                "Aura has detected patterns across your "
                "uploaded files. Regular monthly statements "
                "can improve spending and budget insights."
            ),
            "action_label": "Upload More",
            "source": "rule",
        }

    return {
        "message": (
            "Keep uploading your financial documents regularly "
            "so Aura can build better spending patterns and "
            "smarter recommendations."
        ),
        "action_label": "Upload More",
        "source": "rule",
    }


def get_rule_based_upload_tip(user):
    """
    Deterministic fallback used when AI generation fails.
    """

    return generate_upload_ai_tip(
        user
    )


# ---------------------------------------------------------------------
# Verified AI context
# ---------------------------------------------------------------------

def build_upload_tip_context(user):
    """
    Build compact, verified financial context for the upload tip.

    No LLM calls happen here.
    """

    files = (
        UploadedFile.objects
        .filter(user=user)
        .order_by("-uploaded_at")
    )

    recent_files = files[:5]

    start_date, end_date = (
        get_current_month_period()
    )

    analytics = build_period_analytics(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    recurring = analyze_recurring_expenses(
        user=user,
    )

    metrics = analytics.get(
        "metrics",
        {},
    )

    return {
        "total_uploads": (
            files.count()
        ),

        "successful_uploads": (
            files.filter(
                status=UploadedFile.Status.SUCCESS,
            ).count()
        ),

        "failed_uploads": (
            files.filter(
                status=UploadedFile.Status.FAILED,
            ).count()
        ),

        "processing_uploads": (
            files.filter(
                status=UploadedFile.Status.PROCESSING,
            ).count()
        ),

        "total_transactions": (
            Transaction.objects
            .filter(user=user)
            .count()
        ),

        "recent_uploads": [
            {
                "filename": (
                    file.original_filename
                ),
                "type": (
                    file.file_type
                ),
                "status": (
                    file.status
                ),
                "transactions_found": (
                    file.extracted_transactions_count
                ),
                "uploaded_at": (
                    file.uploaded_at.isoformat()
                    if file.uploaded_at
                    else None
                ),
            }
            for file in recent_files
        ],

        "spending": {
            "total_income": (
                metrics.get(
                    "total_income"
                )
            ),
            "total_income_display": (
                metrics.get(
                    "total_income_display"
                )
            ),
            "total_expense": (
                metrics.get(
                    "total_expense"
                )
            ),
            "total_expense_display": (
                metrics.get(
                    "total_expense_display"
                )
            ),
            "savings": (
                metrics.get(
                    "savings"
                )
            ),
            "savings_display": (
                metrics.get(
                    "savings_display"
                )
            ),
            "savings_rate": (
                metrics.get(
                    "savings_rate",
                    0,
                )
            ),
        },

        "recurring": {
            "subscription_count": (
                recurring.get(
                    "subscription_count",
                    0,
                )
            ),
            "duplicate_count": (
                recurring.get(
                    "duplicate_count",
                    0,
                )
            ),
            "upcoming_count": (
                recurring.get(
                    "upcoming_count",
                    0,
                )
            ),
            "monthly_total": (
                recurring.get(
                    "monthly_total"
                )
            ),
            "monthly_total_display": (
                recurring.get(
                    "monthly_total_display"
                )
            ),
            "recommendation": (
                recurring.get(
                    "recommendation"
                )
            ),
        },
    }


# ---------------------------------------------------------------------
# LangChain AI generation
# ---------------------------------------------------------------------

def _generate_upload_tip_with_ai(
    context: dict,
) -> str:
    """
    Generate one concise upload-page financial insight
    using Aura's shared LangChain model.
    """

    model = (
        get_aura_chat_model()
        .with_structured_output(
            UploadTipOutput
        )
    )

    system_prompt = """
You are Aura, an AI personal finance assistant.

Generate exactly one short financial insight for the upload page.

Rules:

- Use only the supplied verified financial context.
- Never invent amounts, transactions, merchants, or financial facts.
- Prefer a useful spending, recurring-payment, savings, or transaction observation.
- Do not recalculate financial totals yourself.
- Do not mention information that is not present in the supplied context.
- Do not tell the user to upload more files unless there is not enough financial data.
- Keep the message concise and under 28 words.
""".strip()

    user_prompt = (
        "Verified user finance context:\n"
        f"{json.dumps(context, default=str)}"
    )

    result = model.invoke(
        [
            (
                "system",
                system_prompt,
            ),
            (
                "human",
                user_prompt,
            ),
        ]
    )

    if result is None:
        raise ValueError(
            "Aura returned no upload-tip result."
        )

    message = (
        result.message
        or ""
    ).strip()

    if not message:
        raise ValueError(
            "Aura returned an empty upload-tip message."
        )

    return message


# ---------------------------------------------------------------------
# Stored AI tip generation
# ---------------------------------------------------------------------

def generate_and_store_upload_ai_tip(
    user,
    uploaded_file,
):
    """
    Generate and persist a personalized upload-page insight.

    If AI generation fails, fall back to deterministic behavior.
    """

    fallback = (
        get_rule_based_upload_tip(
            user
        )
    )

    context = (
        build_upload_tip_context(
            user
        )
    )

    if context["total_transactions"] == 0:
        _store_upload_tip(
            uploaded_file=uploaded_file,
            message=fallback["message"],
            source="rule",
        )

        return fallback

    try:
        message = (
            _generate_upload_tip_with_ai(
                context
            )
        )

        _store_upload_tip(
            uploaded_file=uploaded_file,
            message=message,
            source="ai",
        )

        return {
            "message": message,
            "source": "ai",
            "action_label": "View Insights",
        }

    except Exception as exc:
        logger.warning(
            "Upload AI tip generation failed: %s",
            exc,
            exc_info=True,
        )

        _store_upload_tip(
            uploaded_file=uploaded_file,
            message=fallback["message"],
            source="rule",
        )

        return fallback


# ---------------------------------------------------------------------
# Persistence helper
# ---------------------------------------------------------------------

def _store_upload_tip(
    *,
    uploaded_file,
    message: str,
    source: str,
):
    uploaded_file.ai_tip_message = (
        message
    )

    uploaded_file.ai_tip_source = (
        source
    )

    uploaded_file.ai_tip_generated_at = (
        timezone.now()
    )

    uploaded_file.save(
        update_fields=[
            "ai_tip_message",
            "ai_tip_source",
            "ai_tip_generated_at",
        ]
    )


# ---------------------------------------------------------------------
# Cached AI tip
# ---------------------------------------------------------------------

def get_cached_upload_ai_tip(user):
    """
    Return the most recently generated stored AI tip.

    Falls back to the deterministic Uploads-page tip when
    no stored tip exists.
    """

    latest_file = (
        UploadedFile.objects
        .filter(
            user=user,
            status=(
                UploadedFile.Status.SUCCESS
            ),
            ai_tip_message__isnull=False,
        )
        .order_by(
            "-ai_tip_generated_at",
            "-uploaded_at",
        )
        .first()
    )

    if latest_file:
        return {
            "message": (
                latest_file.ai_tip_message
            ),
            "source": (
                latest_file.ai_tip_source
                or "ai"
            ),
            "action_label": (
                "View Insights"
                if (
                    latest_file.ai_tip_source
                    == "ai"
                )
                else "Review Results"
            ),
        }

    return get_rule_based_upload_tip(
        user
    )