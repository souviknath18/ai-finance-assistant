import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
} from "lucide-react";

import { ReportDashboard } from "@/types/report";

type PerformanceCardProps = {
  data: ReportDashboard;
};

export default function PerformanceCard({
  data,
}: PerformanceCardProps) {
  const chartItems =
    data.performance.chart ?? [];

  const maxAmount = Math.max(
    ...chartItems.flatMap((item) => [
      Number(item.income) || 0,
      Number(item.expense) || 0,
    ]),
    1
  );

  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:col-span-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Financial Performance
          </p>

          <h2 className="mt-1 text-[18px] font-bold tracking-tight text-black">
            {data.period.title}
          </h2>

          <p className="mt-1 text-[12px] text-[#565e74]">
            {data.period.range}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          {data.period.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          label="Total Income"
          value={data.performance.income}
          helper="Current period"
          icon={<ArrowUp size={13} />}
          tone="green"
        />

        <Metric
          label="Total Expenses"
          value={data.performance.expenses}
          helper="Current period"
          icon={<ArrowDown size={13} />}
          tone="red"
        />

        <Metric
          label="Net Savings"
          value={data.performance.savings}
          helper="Income minus expenses"
          icon={<CheckCircle2 size={13} />}
          tone="default"
        />
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Income vs Expenses
          </p>

          <div className="flex items-center gap-4">
            <Legend
              color="bg-emerald-700"
              label="Income"
            />

            <Legend
              color="bg-[#c8d2df]"
              label="Expenses"
            />
          </div>
        </div>

        {chartItems.length === 0 ? (
          <div className="flex h-44 items-center justify-center">
            <p className="text-[12px] font-medium text-[#565e74]">
              No chart data available yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex h-44 min-w-full items-end gap-3">
              {chartItems.map((item) => {
                const income =
                  Number(item.income) || 0;

                const expense =
                  Number(item.expense) || 0;

                return (
                  <div
                    key={item.month}
                    className="flex min-w-[48px] flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-36 w-full items-end gap-1">
                      {/* Income */}
                      <div
                        title={`Income: ${income.toLocaleString(
                          "en-IN"
                        )}`}
                        className="flex-1 rounded-t-md bg-emerald-700 transition-[height] duration-500"
                        style={{
                          height: getBarHeight(
                            income,
                            maxAmount
                          ),
                        }}
                      />

                      {/* Expenses */}
                      <div
                        title={`Expenses: ${expense.toLocaleString(
                          "en-IN"
                        )}`}
                        className="flex-1 rounded-t-md bg-[#c8d2df] transition-[height] duration-500"
                        style={{
                          height: getBarHeight(
                            expense,
                            maxAmount
                          ),
                        }}
                      />
                    </div>

                    <span className="whitespace-nowrap text-[10px] font-bold text-[#7c839b]">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  helper,
  icon,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone:
    | "green"
    | "red"
    | "default";
}) {
  const valueClass =
    tone === "green"
      ? "text-emerald-700"
      : tone === "red"
      ? "text-red-600"
      : "text-black";

  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-white p-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
        {label}
      </p>

      <h3
        className={`mt-1.5 text-[18px] font-bold tracking-tight ${valueClass}`}
      >
        {value}
      </h3>

      <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#7c839b]">
        {icon}
        {helper}
      </p>
    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#565e74]">
      <div
        className={`h-2 w-2 rounded-full ${color}`}
      />

      {label}
    </div>
  );
}

function getBarHeight(
  value: number,
  maxAmount: number
) {
  if (value <= 0) {
    return "0%";
  }

  const percentage =
    (value / maxAmount) * 100;

  return `${Math.max(
    percentage,
    4
  )}%`;
}