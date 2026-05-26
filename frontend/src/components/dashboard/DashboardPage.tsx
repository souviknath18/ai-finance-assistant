import DashboardNavbar from "./DashboardNavbar";
import MetricCard from "./MetricCard";
import BalanceChart from "./BalanceChart";
import AIInsightsCard from "./AIInsightsCard";
import TopSpendingCard from "./TopSpendingCard";
import RecentTransactionsTable from "./RecentTransactionsTable";

export default function DashboardPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Financial Dashboard
        </h1>
        <p className="mt-1.5 text-[13px] text-[#565e74]">
          AI-powered overview of your income, expenses, savings, and spending behavior.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Balance"
          value="₹1,24,592.00"
          status="+2.4% this month"
          statusType="positive"
        />

        <MetricCard
          label="Monthly Income"
          value="₹84,000.00"
          status="Expected: ₹80,000"
          statusType="neutral"
        />

        <MetricCard
          label="Total Expenses"
          value="₹31,120.45"
          status="12% over average"
          statusType="negative"
        />

        <MetricCard
          label="Monthly Savings"
          value="₹52,879.55"
          status="On track for goal"
          statusType="positive"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <BalanceChart />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <AIInsightsCard />
          <TopSpendingCard />
        </div>

        <div className="lg:col-span-12">
          <RecentTransactionsTable />
        </div>
      </div>
    </>
  );
}