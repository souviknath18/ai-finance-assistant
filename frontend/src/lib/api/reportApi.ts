import { ReportDashboard } from "@/types/report";
import { authFetch } from "@/lib/api/authFetch";

export async function getReportDashboard() {
  const response = await authFetch("/api/reports/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as ReportDashboard;
}

export async function generateReport(interval: string) {
  const response = await authFetch("/api/reports/generate/", {
    method: "POST",
    body: JSON.stringify({ interval }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as {
    report_id: string;
    report: ReportDashboard;
  };
}

export async function getGeneratedReport(reportId: string) {
  const response = await authFetch(
    `/api/reports/generated/${reportId}/`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as {
    report_id: string;
    title: string;
    interval: string;
    period_range: string;
    ai_summary: string;
    report: ReportDashboard;
    created_at: string;
  };
}

export async function exportReportPDF(reportId: string) {
  const response = await authFetch(
    `/api/reports/generated/${reportId}/pdf/`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw await response.json();
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `Aura_Report_${reportId}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}