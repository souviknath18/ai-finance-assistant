from datetime import datetime

from rest_framework import status
from rest_framework.permissions import (
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.insights.services.snapshot_service import (
    get_insights_summary,
    regenerate_insights_snapshot,
)


def parse_date(value):
    if not value:
        return None

    try:
        return datetime.strptime(
            value,
            "%Y-%m-%d",
        ).date()

    except ValueError:
        return None


class InsightsSummaryView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        start_date = parse_date(
            request.GET.get(
                "start_date"
            )
        )

        end_date = parse_date(
            request.GET.get(
                "end_date"
            )
        )

        if bool(start_date) != bool(end_date):
            return Response(
                {
                    "detail": (
                        "Provide both start_date "
                        "and end_date."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            start_date
            and end_date
            and start_date > end_date
        ):
            return Response(
                {
                    "detail": (
                        "start_date cannot be "
                        "after end_date."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = get_insights_summary(
            request.user,
            start_date=start_date,
            end_date=end_date,
        )

        return Response(data)


class RegenerateInsightsView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        data = regenerate_insights_snapshot(
            request.user
        )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )