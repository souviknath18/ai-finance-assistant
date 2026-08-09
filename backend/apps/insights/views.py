from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.insights.serializers import (
    InsightPeriodQuerySerializer,
    InsightSnapshotStatusSerializer,
    RegenerateInsightsSerializer,
)

from apps.insights.services import (
    get_insight_snapshot_status,
    get_insights_summary,
)

from apps.insights.services.snapshot_service import (
    resolve_period_preset,
)

from apps.insights.tasks import (
    regenerate_user_insights_task,
)


class InsightsDashboardView(APIView):
    """
    Return Aura's Insights dashboard.

    GET /api/insights/

    Supported query parameters:

        ?period=this_month

        ?period=last_month

        ?period=last_3_months

        ?period=this_year

        ?period=custom
        &start_date=2026-05-01
        &end_date=2026-07-31

    Behavior:
    - returns a valid cached snapshot immediately when available
    - regenerates synchronously when the snapshot is missing or stale
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        serializer = (
            InsightPeriodQuerySerializer(
                data=request.query_params
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        period = (
            serializer.validated_data.get(
                "period",
                "this_month",
            )
        )

        start_date = (
            serializer.validated_data.get(
                "start_date"
            )
        )

        end_date = (
            serializer.validated_data.get(
                "end_date"
            )
        )

        data = get_insights_summary(
            request.user,
            period=period,
            start_date=start_date,
            end_date=end_date,
            regenerate_if_stale=True,
        )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class RegenerateInsightsView(APIView):
    """
    Queue an asynchronous Insights regeneration.

    POST /api/insights/regenerate/

    Preset example:

        {
            "period": "last_3_months"
        }

    Custom example:

        {
            "period": "custom",
            "start_date": "2026-05-01",
            "end_date": "2026-07-31"
        }

    The preset is resolved into concrete dates before the
    Celery task is queued.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        serializer = (
            RegenerateInsightsSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        period = (
            serializer.validated_data.get(
                "period",
                "this_month",
            )
        )

        start_date = (
            serializer.validated_data.get(
                "start_date"
            )
        )

        end_date = (
            serializer.validated_data.get(
                "end_date"
            )
        )

        # -------------------------------------------------------------
        # Convert preset -> concrete dates
        # -------------------------------------------------------------

        resolved_start_date, resolved_end_date = (
            resolve_period_preset(
                period=period,
                start_date=start_date,
                end_date=end_date,
            )
        )

        # -------------------------------------------------------------
        # Queue Celery regeneration
        # -------------------------------------------------------------

        task = (
            regenerate_user_insights_task.delay(
                str(request.user.pk),
                resolved_start_date.isoformat(),
                resolved_end_date.isoformat(),
            )
        )

        # -------------------------------------------------------------
        # Return current snapshot status
        # -------------------------------------------------------------

        snapshot_status = (
            get_insight_snapshot_status(
                user=request.user,
                period="custom",
                start_date=resolved_start_date,
                end_date=resolved_end_date,
            )
        )

        return Response(
            {
                "detail": (
                    "Insight regeneration has been queued."
                ),

                "task_id": task.id,

                "snapshot": (
                    snapshot_status
                ),
            },
            status=status.HTTP_202_ACCEPTED,
        )


class InsightStatusView(APIView):
    """
    Return current InsightSnapshot generation status.

    GET /api/insights/status/

    Examples:

        /api/insights/status/?period=this_month

        /api/insights/status/?period=last_3_months

        /api/insights/status/
            ?period=custom
            &start_date=2026-05-01
            &end_date=2026-07-31

    Frontend polling flow:

        POST /regenerate/
              ↓
        GET /status/
              ↓
        generating
              ↓
        GET /status/
              ↓
        ready
              ↓
        GET /api/insights/
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        query_serializer = (
            InsightPeriodQuerySerializer(
                data=request.query_params
            )
        )

        query_serializer.is_valid(
            raise_exception=True
        )

        period = (
            query_serializer.validated_data.get(
                "period",
                "this_month",
            )
        )

        start_date = (
            query_serializer.validated_data.get(
                "start_date"
            )
        )

        end_date = (
            query_serializer.validated_data.get(
                "end_date"
            )
        )

        result = (
            get_insight_snapshot_status(
                user=request.user,
                period=period,
                start_date=start_date,
                end_date=end_date,
            )
        )

        response_serializer = (
            InsightSnapshotStatusSerializer(
                data=result
            )
        )

        response_serializer.is_valid(
            raise_exception=True
        )

        return Response(
            response_serializer.validated_data,
            status=status.HTTP_200_OK,
        )