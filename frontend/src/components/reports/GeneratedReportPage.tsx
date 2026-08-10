"use client";

import {
  useEffect,
  useState,
} from "react";

import PerformanceCard from "./PerformanceCard";
import AIReportInsight from "./AIReportInsight";
import CategorySpendingCard from "./CategorySpendingCard";
import RecurringPaymentsCard from "./RecurringPaymentsCard";
import ReportActions from "./ReportActions";

import PageLoader from "@/components/ui/PageLoader";

import {
  exportReportPDF,
  getGeneratedReport,
} from "@/lib/api/reportApi";

import { ReportDashboard } from "@/types/report";

type Props = {
  reportId: string;
};

export default function GeneratedReportPage({
  reportId,
}: Props) {
  const [data, setData] =
    useState<ReportDashboard | null>(
      null
    );

  const [exporting, setExporting] =
    useState(false);

  useEffect(() => {
    async function load() {
      const result =
        await getGeneratedReport(
          reportId
        );

      setData(
        result.report
      );
    }

    load();
  }, [reportId]);

  const handleExportPDF =
    async () => {
      setExporting(true);

      try {
        await exportReportPDF(
          reportId
        );
      } finally {
        setExporting(false);
      }
    };

  if (!data) {
    return <PageLoader />;
  }

  return (
    <>
      <section className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          Aura Financial Intelligence
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-black">
          Generated Financial Report
        </h1>

        <p className="mt-1.5 text-[12px] text-[#565e74]">
          Report ID:{" "}
          <span className="font-semibold text-black">
            {reportId}
          </span>
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <PerformanceCard
          data={data}
        />

        <AIReportInsight
          data={data.ai_insight}
        />

        <CategorySpendingCard
          categories={
            data.categories
          }
        />

        <RecurringPaymentsCard
          payments={
            data.recurring_payments
          }
          count={
            data.recurring_count
          }
        />
      </section>

      <ReportActions
        disabled={false}
        exporting={
          exporting
        }
        onExportPDFAction={
          handleExportPDF
        }
      />
    </>
  );
}