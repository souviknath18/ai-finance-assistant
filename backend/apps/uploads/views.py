from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UploadedFile
from .serializers import UploadedFileSerializer, UploadCreateSerializer
from .services import detect_file_type, process_uploaded_file


class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UploadCreateSerializer(data=request.data)

        if serializer.is_valid():
            file = serializer.validated_data["file"]

            uploaded_file = UploadedFile.objects.create(
                user=request.user,
                file=file,
                original_filename=file.name,
                file_type=detect_file_type(file.name),
                file_size=file.size,
                status=UploadedFile.Status.PENDING,
            )

            process_uploaded_file(uploaded_file)

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
        files = UploadedFile.objects.filter(user=request.user).order_by("-uploaded_at")

        serializer = UploadedFileSerializer(
            files,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


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

        return Response(
            {"detail": "File deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class RetryUploadProcessingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        uploaded_file = UploadedFile.objects.get(id=pk, user=request.user)

        processed_file = process_uploaded_file(uploaded_file)

        serializer = UploadedFileSerializer(
            processed_file,
            context={"request": request},
        )

        return Response(serializer.data)