from rest_framework import serializers

from apps.insights.models import (
    InsightSnapshot,
)


class InsightSnapshotSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = InsightSnapshot

        fields = [
            "insight_id",
            "period_start",
            "period_end",
            "data",
            "status",
            "is_stale",
            "generated_at",
            "updated_at",
        ]

        read_only_fields = fields