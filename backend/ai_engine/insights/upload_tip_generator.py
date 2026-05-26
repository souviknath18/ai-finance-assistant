import json
from decouple import config
from openai import OpenAI
from django.utils import timezone

from apps.uploads.models import UploadedFile
from apps.transactions.models import Transaction
from ai_engine.insights.spending_analysis import get_spending_overview
from ai_engine.insights.recurring_analysis import analyze_recurring_expenses
from ai_engine.insights.financial_health import calculate_financial_health

client = OpenAI(api_key=config("OPENAI_API_KEY"))


def get_rule_based_upload_tip(user):
    return {
        "message": "Aura is preparing personalized financial insights based on your uploaded transaction activity.",
        "source": "rule",
    }


def build_upload_tip_context(user):
    files = UploadedFile.objects.filter(user=user).order_by("-uploaded_at")
    recent_files = files[:5]

    spending = get_spending_overview(user)
    recurring = analyze_recurring_expenses(user)
    health = calculate_financial_health(user)

    return {
        "total_uploads": files.count(),
        "successful_uploads": files.filter(status=UploadedFile.Status.SUCCESS).count(),
        "failed_uploads": files.filter(status=UploadedFile.Status.FAILED).count(),
        "total_transactions": Transaction.objects.filter(user=user).count(),
        "recent_uploads": [
            {
                "filename": file.original_filename,
                "type": file.file_type,
                "status": file.status,
                "transactions_found": file.extracted_transactions_count,
                "uploaded_at": str(file.uploaded_at),
            }
            for file in recent_files
        ],
        "spending": spending,
        "recurring": {
            "subscription_count": recurring["subscription_count"],
            "duplicate_count": recurring["duplicate_count"],
            "monthly_total_display": recurring["monthly_total_display"],
            "recommendation": recurring["recommendation"],
        },
        "financial_health": health,
    }


def generate_and_store_upload_ai_tip(user, uploaded_file):
    fallback = get_rule_based_upload_tip(user)
    context = build_upload_tip_context(user)

    if context["total_transactions"] == 0:
        uploaded_file.ai_tip_message = fallback["message"]
        uploaded_file.ai_tip_source = "rule"
        uploaded_file.ai_tip_generated_at = timezone.now()
        uploaded_file.save(
            update_fields=[
                "ai_tip_message",
                "ai_tip_source",
                "ai_tip_generated_at",
            ]
        )
        return fallback

    system_prompt = """
You are Aura, an AI personal finance assistant.

Generate one short financial insight for the upload page.

Rules:
- This must be an insight, not an instruction to upload more files.
- Use only the provided context.
- Mention a useful pattern, status, transaction insight, recurring payment insight, or financial health insight.
- Keep the message under 28 words.
- Do not invent numbers.
- Do not mention unavailable data.
- Return JSON only with key: message.
"""

    user_prompt = f"""
User upload and finance context:
{context}

Generate one concise financial insight for the upload page.
"""

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            text={"format": {"type": "json_object"}},
        )

        data = json.loads(response.output_text)

        message = data.get("message") or fallback["message"]

        uploaded_file.ai_tip_message = message
        uploaded_file.ai_tip_source = "ai"
        uploaded_file.ai_tip_generated_at = timezone.now()
        uploaded_file.save(
            update_fields=[
                "ai_tip_message",
                "ai_tip_source",
                "ai_tip_generated_at",
            ]
        )

        return {
            "message": message,
            "source": "ai",
        }

    except Exception:
        uploaded_file.ai_tip_message = fallback["message"]
        uploaded_file.ai_tip_source = "rule"
        uploaded_file.ai_tip_generated_at = timezone.now()
        uploaded_file.save(
            update_fields=[
                "ai_tip_message",
                "ai_tip_source",
                "ai_tip_generated_at",
            ]
        )
        return fallback


def get_cached_upload_ai_tip(user):
    latest_file = (
        UploadedFile.objects.filter(
            user=user,
            status=UploadedFile.Status.SUCCESS,
            ai_tip_message__isnull=False,
        )
        .order_by("-ai_tip_generated_at", "-uploaded_at")
        .first()
    )

    if latest_file:
        return {
            "message": latest_file.ai_tip_message,
            "source": latest_file.ai_tip_source or "ai",
        }

    return get_rule_based_upload_tip(user)