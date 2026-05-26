from decouple import config
from openai import OpenAI

from apps.uploads.models import UploadedFile
from apps.transactions.models import Transaction
from ai_engine.insights.spending_analysis import get_spending_overview
from ai_engine.insights.recurring_expense_analysis import analyze_recurring_expenses
from ai_engine.insights.financial_health import calculate_financial_health

client = OpenAI(api_key=config("OPENAI_API_KEY"))


def get_rule_based_upload_tip(user):
    files = UploadedFile.objects.filter(user=user).order_by("-uploaded_at")

    total_files = files.count()
    latest_file = files.first()

    if total_files == 0:
        return {
            "message": "Upload your first bank statement, CSV, or invoice so Aura can start generating personalized insights.",
            "action_label": "Upload File",
            "source": "rule",
        }

    if latest_file and latest_file.status == UploadedFile.Status.FAILED:
        return {
            "message": "Your latest file could not be processed. Try uploading a digital PDF or a properly formatted CSV for better extraction accuracy.",
            "action_label": "Retry Upload",
            "source": "rule",
        }

    if latest_file and latest_file.status in [
        UploadedFile.Status.PENDING,
        UploadedFile.Status.PROCESSING,
    ]:
        return {
            "message": "Aura is analyzing your latest upload. Your insights will improve once processing is complete.",
            "action_label": "View Progress",
            "source": "rule",
        }

    return {
        "message": "Upload monthly statements regularly so Aura can detect recurring patterns, spending changes, and savings opportunities.",
        "action_label": "Upload More",
        "source": "rule",
    }


def build_upload_tip_context(user):
    files = UploadedFile.objects.filter(user=user).order_by("-uploaded_at")
    recent_files = files[:5]

    total_transactions = Transaction.objects.filter(user=user).count()

    spending = get_spending_overview(user)
    recurring = analyze_recurring_expenses(user)
    health = calculate_financial_health(user)

    recent_uploads = []

    for file in recent_files:
        recent_uploads.append(
            {
                "filename": file.original_filename,
                "type": file.file_type,
                "status": file.status,
                "transactions_found": file.extracted_transactions_count,
                "uploaded_at": str(file.uploaded_at),
            }
        )

    return {
        "total_uploads": files.count(),
        "successful_uploads": files.filter(status=UploadedFile.Status.SUCCESS).count(),
        "failed_uploads": files.filter(status=UploadedFile.Status.FAILED).count(),
        "total_transactions": total_transactions,
        "recent_uploads": recent_uploads,
        "spending": spending,
        "recurring": {
            "subscription_count": recurring["subscription_count"],
            "duplicate_count": recurring["duplicate_count"],
            "monthly_total_display": recurring["monthly_total_display"],
            "recommendation": recurring["recommendation"],
        },
        "financial_health": health,
    }


def generate_upload_ai_tip(user):
    fallback = get_rule_based_upload_tip(user)

    context = build_upload_tip_context(user)

    if context["total_uploads"] == 0 or context["total_transactions"] == 0:
        return fallback

    system_prompt = """
You are Aura, an AI personal finance assistant.

Generate one short, useful upload-page tip based only on the provided user context.

Rules:
- Keep the message under 28 words.
- Make it actionable.
- Do not invent numbers.
- Do not mention unavailable data.
- Return JSON only with keys: message, action_label.
"""

    user_prompt = f"""
User upload and finance context:
{context}

Generate a personalized upload tip for the upload page.
"""

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            text={
                "format": {
                    "type": "json_object"
                }
            },
        )

        import json

        data = json.loads(response.output_text)

        return {
            "message": data.get("message") or fallback["message"],
            "action_label": data.get("action_label") or fallback["action_label"],
            "source": "ai",
        }

    except Exception:
        return fallback