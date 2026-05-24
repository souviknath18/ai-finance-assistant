import json
from io import BytesIO

from django.core.serializers.json import DjangoJSONEncoder
from django.http import FileResponse

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GeneratedReport
from .services import get_report_dashboard

from ai_engine.reports.report_ai_writer import (
    generate_ai_report_summary,
)


def clean_pdf_text(value):
    """
    ReportLab Helvetica does not support ₹ properly.
    Replace with INR for PDF compatibility.
    """
    return str(value).replace("₹", "INR ")


def draw_wrapped_text(
    pdf,
    text,
    x,
    y,
    max_width,
    line_height=15,
):
    """
    Wrap long text inside PDF page width.
    """
    words = clean_pdf_text(text).split()

    line = ""

    for word in words:
        test_line = f"{line} {word}".strip()

        if pdf.stringWidth(test_line, "Helvetica", 10) <= max_width:
            line = test_line

        else:
            pdf.drawString(x, y, line)
            y -= line_height
            line = word

    if line:
        pdf.drawString(x, y, line)
        y -= line_height

    return y


class ReportDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_report_dashboard(request.user)
        return Response(data)


class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        interval = request.data.get("interval", "monthly")

        report_data = get_report_dashboard(request.user)

        try:
            ai_summary = generate_ai_report_summary(report_data)

        except Exception as error:
            print("AI report generation failed:", error)

            ai_summary = report_data["ai_insight"]["summary"]

        report_data["ai_insight"]["summary"] = ai_summary

        serialized_report_data = json.loads(
            json.dumps(
                report_data,
                cls=DjangoJSONEncoder,
            )
        )

        report = GeneratedReport.objects.create(
            user=request.user,
            title=report_data["period"]["title"],
            interval=interval,
            period_range=report_data["period"]["range"],
            report_data=serialized_report_data,
            ai_summary=ai_summary,
        )

        return Response(
            {
                "report_id": report.report_id,
                "report": report_data,
            },
            status=status.HTTP_201_CREATED,
        )


class ExportReportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id):
        report = GeneratedReport.objects.get(
            user=request.user,
            report_id=report_id,
        )

        data = report.report_data

        buffer = BytesIO()

        pdf = canvas.Canvas(
            buffer,
            pagesize=A4,
        )

        width, height = A4

        y = height - 60

        # =========================
        # HEADER
        # =========================

        pdf.setFont("Helvetica-Bold", 20)

        pdf.drawString(
            50,
            y,
            "Aura Financial Intelligence Report",
        )

        y -= 35

        pdf.setFont("Helvetica", 10)

        pdf.drawString(
            50,
            y,
            clean_pdf_text(f"Report ID: {report.report_id}"),
        )

        y -= 18

        pdf.drawString(
            50,
            y,
            clean_pdf_text(f"Period: {data['period']['range']}"),
        )

        y -= 35

        # =========================
        # PERFORMANCE
        # =========================

        pdf.setFont("Helvetica-Bold", 14)

        pdf.drawString(
            50,
            y,
            "Financial Performance",
        )

        y -= 25

        pdf.setFont("Helvetica", 11)

        pdf.drawString(
            50,
            y,
            clean_pdf_text(
                f"Income: {data['performance']['income']}"
            ),
        )

        y -= 18

        pdf.drawString(
            50,
            y,
            clean_pdf_text(
                f"Expenses: {data['performance']['expenses']}"
            ),
        )

        y -= 18

        pdf.drawString(
            50,
            y,
            clean_pdf_text(
                f"Net Savings: {data['performance']['savings']}"
            ),
        )

        y -= 35

        # =========================
        # AI INSIGHT
        # =========================

        pdf.setFont("Helvetica-Bold", 14)

        pdf.drawString(
            50,
            y,
            "AI Executive Insight",
        )

        y -= 25

        pdf.setFont("Helvetica", 10)

        y = draw_wrapped_text(
            pdf=pdf,
            text=data["ai_insight"]["summary"],
            x=50,
            y=y,
            max_width=500,
            line_height=16,
        )

        y -= 20

        # =========================
        # CATEGORY BREAKDOWN
        # =========================

        pdf.setFont("Helvetica-Bold", 14)

        pdf.drawString(
            50,
            y,
            "Top Spending Categories",
        )

        y -= 25

        pdf.setFont("Helvetica", 10)

        for category in data["categories"]:

            pdf.drawString(
                50,
                y,
                clean_pdf_text(
                    f"{category['label']} - {category['value']}"
                ),
            )

            y -= 18

        y -= 15

        # =========================
        # RECURRING PAYMENTS
        # =========================

        pdf.setFont("Helvetica-Bold", 14)

        pdf.drawString(
            50,
            y,
            "Recurring Payments",
        )

        y -= 25

        pdf.setFont("Helvetica", 10)

        for payment in data["recurring_payments"]:

            pdf.drawString(
                50,
                y,
                clean_pdf_text(
                    f"{payment['merchant']} - ₹{payment['average_amount']}"
                ),
            )

            y -= 18

        y -= 20

        # =========================
        # FOOTER
        # =========================

        pdf.setFont("Helvetica-Oblique", 9)

        pdf.drawString(
            50,
            40,
            "Generated by Aura AI Financial Intelligence Platform",
        )

        pdf.showPage()

        pdf.save()

        buffer.seek(0)

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"{report.report_id}.pdf",
            content_type="application/pdf",
        )


class GeneratedReportDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id):
        report = GeneratedReport.objects.get(
            user=request.user,
            report_id=report_id,
        )

        return Response(
            {
                "report_id": report.report_id,
                "title": report.title,
                "interval": report.interval,
                "period_range": report.period_range,
                "ai_summary": report.ai_summary,
                "report": report.report_data,
                "created_at": report.created_at,
            },
            status=status.HTTP_200_OK,
        )