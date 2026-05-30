from django.core.files.storage import default_storage
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from ai_engine.insights.upload_tip_generator import get_cached_upload_ai_tip
from math import ceil
from django.db.models import Sum
from .models import UploadedFile
from apps.insights.services import mark_insights_stale
from .serializers import (
    UploadedFileSerializer,
    UploadedFileListSerializer,
    UploadCreateSerializer,
)
from .services import detect_file_type
from .tasks import (
    process_uploaded_file_task,
    cleanup_stuck_uploads_for_user_task,
)


class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UploadCreateSerializer(data=request.data)

        if serializer.is_valid():
            file = serializer.validated_data["file"]
            print("DEFAULT STORAGE:", default_storage.__class__)

            uploaded_file = UploadedFile.objects.create(
                user=request.user,
                file=file,
                original_filename=file.name,
                file_type=detect_file_type(file.name),
                file_size=file.size,
                status=UploadedFile.Status.PENDING,
            )

            process_uploaded_file_task.delay(uploaded_file.id)

            response_serializer = UploadedFileSerializer(
                uploaded_file,
                context={"request": request},
            )

            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UploadedFileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cleanup_stuck_uploads_for_user_task.delay(request.user.id)

        files = UploadedFile.objects.filter(user=request.user).order_by("-uploaded_at")

        status_filter = request.GET.get("status", "").strip()
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 10))

        page = max(page, 1)
        page_size = min(max(page_size, 1), 50)

        if status_filter and status_filter != "all":
            files = files.filter(status=status_filter)

        total = files.count()
        total_pages = ceil(total / page_size) if total else 0

        start = (page - 1) * page_size
        end = start + page_size

        serializer = UploadedFileListSerializer(files[start:end], many=True)

        return Response({
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
            "results": serializer.data,
        })


class UploadedFileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        return UploadedFile.objects.get(id=pk, user=request.user)

    def get(self, request, pk):
        uploaded_file = self.get_object(request, pk)

        serializer = UploadedFileSerializer(
            uploaded_file,
            context={"request": request},
        )

        return Response(serializer.data)

    def delete(self, request, pk):
        uploaded_file = self.get_object(request, pk)
        uploaded_file.file.delete(save=False)
        uploaded_file.delete()

        mark_insights_stale(request.user)

        return Response(
            {"detail": "File deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class RetryUploadProcessingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        uploaded_file = UploadedFile.objects.get(id=pk, user=request.user)

        uploaded_file.status = UploadedFile.Status.PENDING
        uploaded_file.error_message = None
        uploaded_file.processed_at = None
        uploaded_file.uploaded_at = timezone.now()
        uploaded_file.save(
            update_fields=[
                "status",
                "error_message",
                "processed_at",
                "uploaded_at",
            ]
        )

        process_uploaded_file_task.delay(uploaded_file.id)

        serializer = UploadedFileSerializer(
            uploaded_file,
            context={"request": request},
        )

        return Response(serializer.data)


class UploadAITipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tip = get_cached_upload_ai_tip(request.user)
        return Response(tip)
    

class UploadStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        files = UploadedFile.objects.filter(user=request.user)

        total_uploads = files.count()
        successful_uploads = files.filter(status=UploadedFile.Status.SUCCESS).count()

        success_rate = (
            round((successful_uploads / total_uploads) * 100, 1)
            if total_uploads > 0
            else 0
        )

        transactions_extracted = (
            files.aggregate(total=Sum("extracted_transactions_count"))["total"] or 0
        )

        storage_used_bytes = files.aggregate(total=Sum("file_size"))["total"] or 0
        storage_used_mb = round(storage_used_bytes / (1024 * 1024), 2)

        return Response({
            "total_uploads": total_uploads,
            "success_rate": success_rate,
            "transactions_extracted": transactions_extracted,
            "storage_used_mb": storage_used_mb,
        })