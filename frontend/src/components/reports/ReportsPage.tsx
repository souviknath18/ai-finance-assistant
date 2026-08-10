"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import ReportsHeader from "./ReportsHeader";
import ReportGenerator from "./ReportGenerator";
import PerformanceCard from "./PerformanceCard";
import AIReportInsight from "./AIReportInsight";
import CategorySpendingCard from "./CategorySpendingCard";
import RecurringPaymentsCard from "./RecurringPaymentsCard";

import PageLoader from "@/components/ui/PageLoader";
import ErrorScreen from "@/components/ui/ErrorScreen";

import {
  generateReport,
  getReportDashboard,
} from "@/lib/api/reportApi";

import { ReportDashboard } from "@/types/report";

export default function ReportsPage() {
  const router = useRouter();

  const [data, setData] =
    useState<ReportDashboard | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadReport =
    useCallback(async () => {
      try {
        setError(null);

        const result =
          await getReportDashboard();

        setData(result);
      } catch (error) {
        console.error(
          "Failed to load report:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load report."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleGenerateReport = async (
    interval: string,
    startDate?: string,
    endDate?: string
  ) => {
    setGenerating(true);

    try {
      const result =
        await generateReport(
          interval,
          startDate,
          endDate
        );

      router.push(
        `/reports/${result.report_id}`
      );
    } catch (error) {
      console.error(
        "Failed to generate report:",
        error
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Unable to load reports"
        message={error}
        retryText="Try Again"
        onRetryAction={() => {
          setLoading(true);
          loadReport();
        }}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <ReportsHeader />

      <ReportGenerator
        loading={generating}
        onGenerateAction={
          handleGenerateReport
        }
      />

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
    </>
  );
}