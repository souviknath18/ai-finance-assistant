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
from apps.insights.services.financial_health import (
    calculate_financial_health,
)
from apps.insights.services.recurring_detector import (
    analyze_recurring_expenses,
)
from apps.insights.services.trend_analyzer import (
    build_trend_analysis,
)
from apps.transactions.models import Transaction
from apps.uploads.models import UploadedFile


logger = logging.getLogger(__name__)


class UploadTipOutput(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=220,
    )


def get_rule_based_upload_tip(user):
    return {
        "message": (
            "Aura is preparing personalized financial "
            "insights based on your uploaded transaction activity."
        ),
        "source": "rule",
    }


def build_upload_tip_context(user):
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

    # Upload tips do not need the complete Insights pipeline.
    # We keep this context intentionally compact.
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
                status=UploadedFile.Status.SUCCESS
            ).count()
        ),

        "failed_uploads": (
            files.filter(
                status=UploadedFile.Status.FAILED
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


def _generate_upload_tip_with_ai(
    context: dict,
) -> str:
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
- Use only the supplied verified context.
- Do not invent amounts, merchants, transactions, or financial facts.
- Prefer a useful spending, recurring-payment, or transaction observation.
- Do not tell the user to upload more files unless there is no usable data.
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

    return result.message.strip()


def generate_and_store_upload_ai_tip(
    user,
    uploaded_file,
):
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


def get_cached_upload_ai_tip(user):
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
        }

    return get_rule_based_upload_tip(
        user
    )