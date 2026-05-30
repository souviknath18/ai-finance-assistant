"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReportGenerator from "./ReportGenerator";
import PerformanceCard from "./PerformanceCard";
import AIReportInsight from "./AIReportInsight";
import CategorySpendingCard from "./CategorySpendingCard";
import RecurringPaymentsCard from "./RecurringPaymentsCard";
import PageLoader from "@/components/ui/PageLoader";

import {
  getReportDashboard,
  generateReport,
} from "@/lib/api/reportApi";
import { ReportDashboard } from "@/types/report";

export default function ReportsPage() {
  const router = useRouter();
  const [data, setData] = useState<ReportDashboard | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadReport = async () => {
    setLoading(true);

    try {
      const result = await getReportDashboard();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleGenerateReport = async (interval: string) => {
    setGenerating(true);

    try {
      const result = await generateReport(interval);
      router.push(`/reports/${result.report_id}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading reports..." />;
  }

  if (!data) {
    return (
      <p className="text-[13px] font-semibold text-red-600">
        Failed to load report.
      </p>
    );
  }

  return (
    <>
      <section className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Financial Reports
        </h1>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          Generate AI-powered financial reports, spending summaries, and
          export-ready insights.
        </p>
      </section>

      <ReportGenerator
        loading={generating}
        onGenerateAction={handleGenerateReport}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <PerformanceCard data={data} />
        <AIReportInsight data={data.ai_insight} />
        <CategorySpendingCard categories={data.categories} />
        <RecurringPaymentsCard
          payments={data.recurring_payments}
          count={data.recurring_count}
        />
      </section>
    </>
  );
}