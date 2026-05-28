from .models import UploadedFile


def generate_upload_ai_tip(user):
    files = UploadedFile.objects.filter(user=user).order_by("-uploaded_at")

    total_files = files.count()
    successful_files = files.filter(status=UploadedFile.Status.SUCCESS).count()
    failed_files = files.filter(status=UploadedFile.Status.FAILED).count()
    processing_files = files.filter(status=UploadedFile.Status.PROCESSING).count()

    latest_file = files.first()

    if total_files == 0:
        return {
            "message": "Upload your first bank statement, CSV, or invoice so Aura can start generating personalized financial insights.",
            "action_label": "Upload File",
        }

    if processing_files > 0:
        return {
            "message": "Aura is currently analyzing your latest upload. Your parsed transactions and insights will appear once processing is complete.",
            "action_label": "View Progress",
        }

    if failed_files > 0 and latest_file and latest_file.status == UploadedFile.Status.FAILED:
        return {
            "message": "Your latest file could not be processed. Try uploading a clearer PDF or a properly formatted CSV for better extraction accuracy.",
            "action_label": "Retry Upload",
        }

    if successful_files >= 3:
        return {
            "message": "Aura has detected recurring patterns across your uploaded files. Uploading more monthly statements can improve spending insights and budget recommendations.",
            "action_label": "Upload More",
        }

    if latest_file and latest_file.extracted_transactions_count > 0:
        return {
            "message": f"Aura extracted {latest_file.extracted_transactions_count} transactions from your latest upload. Review them to improve category accuracy.",
            "action_label": "Review Results",
        }

    return {
        "message": "Keep uploading your financial documents regularly so Aura can build better spending patterns and smarter recommendations.",
        "action_label": "Upload More",
    }