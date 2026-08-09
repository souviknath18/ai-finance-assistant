from rest_framework import serializers

from apps.insights.models import InsightSnapshot


class InsightPeriodChoices:
    THIS_MONTH = "this_month"
    LAST_MONTH = "last_month"
    LAST_3_MONTHS = "last_3_months"
    THIS_YEAR = "this_year"
    CUSTOM = "custom"

    CHOICES = [
        (THIS_MONTH, "This Month"),
        (LAST_MONTH, "Last Month"),
        (LAST_3_MONTHS, "Last 3 Months"),
        (THIS_YEAR, "This Year"),
        (CUSTOM, "Custom"),
    ]


class InsightSnapshotSerializer(
    serializers.ModelSerializer
):
    """
    Serializer for InsightSnapshot metadata.

    Useful for:
    - snapshot status endpoints
    - admin/debug views
    - future history endpoints

    The main dashboard endpoint can still
    return snapshot.data directly.
    """

    class Meta:
        model = InsightSnapshot

        fields = [
            "insight_id",
            "period_start",
            "period_end",
            "status",
            "is_stale",
            "generated_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields


class InsightSnapshotStatusSerializer(
    serializers.Serializer
):
    """
    Lightweight snapshot status response.

    Used by the frontend while asynchronous
    insight regeneration is running.
    """

    insight_id = serializers.CharField()

    status = serializers.ChoiceField(
        choices=InsightSnapshot.Status.choices,
    )

    is_stale = serializers.BooleanField()

    has_data = serializers.BooleanField()

    generated_at = serializers.DateTimeField(
        allow_null=True,
    )

    period = serializers.DictField()

    error = serializers.CharField(
        allow_null=True,
        allow_blank=True,
        required=False,
    )


class InsightPeriodQuerySerializer(
    serializers.Serializer
):
    """
    Validate insight period selection.

    Supported presets:

        this_month
        last_month
        last_3_months
        this_year
        custom

    For preset periods:
        start_date/end_date are not required.

    For custom:
        both start_date and end_date are required.
    """

    period = serializers.ChoiceField(
        choices=InsightPeriodChoices.CHOICES,
        required=False,
        default=InsightPeriodChoices.THIS_MONTH,
    )

    start_date = serializers.DateField(
        required=False,
    )

    end_date = serializers.DateField(
        required=False,
    )

    def validate(self, attrs):
        period = attrs.get(
            "period",
            InsightPeriodChoices.THIS_MONTH,
        )

        start_date = attrs.get(
            "start_date"
        )

        end_date = attrs.get(
            "end_date"
        )

        # -------------------------------------------------------------
        # Custom period
        # -------------------------------------------------------------

        if (
            period
            == InsightPeriodChoices.CUSTOM
        ):
            if (
                not start_date
                or not end_date
            ):
                raise serializers.ValidationError(
                    {
                        "detail": (
                            "start_date and end_date "
                            "are required when "
                            "period=custom."
                        )
                    }
                )

        # -------------------------------------------------------------
        # Preset period
        # -------------------------------------------------------------

        else:
            if (
                start_date
                or end_date
            ):
                raise serializers.ValidationError(
                    {
                        "detail": (
                            "start_date and end_date "
                            "should only be provided "
                            "when period=custom."
                        )
                    }
                )

        # -------------------------------------------------------------
        # Date ordering
        # -------------------------------------------------------------

        if (
            start_date
            and end_date
            and start_date > end_date
        ):
            raise serializers.ValidationError(
                {
                    "detail": (
                        "start_date cannot be "
                        "after end_date."
                    )
                }
            )

        return attrs


class RegenerateInsightsSerializer(
    InsightPeriodQuerySerializer
):
    """
    Uses exactly the same period validation
    as the normal Insights dashboard request.

    Examples:

        {
            "period": "this_month"
        }

        {
            "period": "last_3_months"
        }

        {
            "period": "custom",
            "start_date": "2026-05-01",
            "end_date": "2026-07-31"
        }
    """

    pass