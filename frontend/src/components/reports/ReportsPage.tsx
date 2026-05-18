import ReportGenerator from "./ReportGenerator";
import PerformanceCard from "./PerformanceCard";
import AIReportInsight from "./AIReportInsight";
import CategorySpendingCard from "./CategorySpendingCard";
import RecurringPaymentsCard from "./RecurringPaymentsCard";
import ReportActions from "./ReportActions";

export default function ReportsPage() {
  return (
    <>
      <section className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Financial Reports
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Generate AI-powered financial reports, spending summaries, and
          export-ready insights.
        </p>
      </section>

      <ReportGenerator />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <PerformanceCard />
        <AIReportInsight />
        <CategorySpendingCard />
        <RecurringPaymentsCard />
      </section>

      <ReportActions />
    </>
  );
}