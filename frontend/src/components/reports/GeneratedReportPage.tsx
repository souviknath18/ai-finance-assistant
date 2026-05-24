"use client";

import { useEffect, useState } from "react";
import PerformanceCard from "./PerformanceCard";
import AIReportInsight from "./AIReportInsight";
import CategorySpendingCard from "./CategorySpendingCard";
import RecurringPaymentsCard from "./RecurringPaymentsCard";
import ReportActions from "./ReportActions";
import { getGeneratedReport, exportReportPDF } from "@/lib/api/reportApi";
import { ReportDashboard } from "@/types/report";

type Props = {
  reportId: string;
};

export default function GeneratedReportPage({ reportId }: Props) {
  const [data, setData] = useState<ReportDashboard | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getGeneratedReport(reportId);
      setData(result.report);
    }

    load();
  }, [reportId]);

  const handleExportPDF = async () => {
    setExporting(true);

    try {
      await exportReportPDF(reportId);
    } finally {
      setExporting(false);
    }
  };

  if (!data) {
    return (
      <p className="text-sm font-semibold text-[#565e74]">
        Loading generated report...
      </p>
    );
  }

  return (
    <>
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Generated Financial Report
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Report ID: {reportId}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <PerformanceCard data={data} />
        <AIReportInsight data={data.ai_insight} />
        <CategorySpendingCard categories={data.categories} />
        <RecurringPaymentsCard
          payments={data.recurring_payments}
          count={data.recurring_count}
        />
      </section>

      <ReportActions
        disabled={false}
        exporting={exporting}
        onExportPDFAction={handleExportPDF}
      />
    </>
  );
}