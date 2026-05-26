import { ArrowUp, CheckCircle2 } from "lucide-react";
import { ReportDashboard } from "@/types/report";

type PerformanceCardProps = {
  data: ReportDashboard;
};

export default function PerformanceCard({ data }: PerformanceCardProps) {
  const chartItems = data.performance.chart;

  const maxAmount = Math.max(
    ...chartItems.flatMap((item) => [item.income, item.expense]),
    1
  );

  return (
    <div className="relative z-0 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:col-span-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-black">
            {data.period.title}
          </h2>

          <p className="mt-1 text-[13px] text-[#565e74]">
            {data.period.range}
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
          Status: {data.period.status}
        </span>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric
          label="Total Income"
          value={data.performance.income}
          tone="green"
          helper="Current period"
          icon={<ArrowUp size={14} />}
        />

        <Metric
          label="Total Expenses"
          value={data.performance.expenses}
          tone="red"
          helper="Current period"
          icon={<ArrowUp size={14} />}
        />

        <Metric
          label="Net Savings"
          value={data.performance.savings}
          tone="blue"
          helper="Calculated from income"
          icon={<CheckCircle2 size={14} />}
        />
      </div>

      <div className="rounded-2xl bg-[#eff4ff] p-5">
        <div className="mb-4 flex justify-end gap-4">
          <Legend color="bg-emerald-700" label="Income" />
          <Legend color="bg-black/10" label="Expenses" />
        </div>

        <div className="flex h-44 items-end overflow-hidden">
          {chartItems.length === 0 ? (
            <p className="m-auto text-[13px] font-semibold text-[#565e74]">
              No chart data available yet.
            </p>
          ) : (
            <div className="flex h-full w-full items-end gap-3 pt-5">
              {chartItems.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-36 w-full items-end gap-1">
                    <div
                      className="flex-1 rounded-t-md bg-emerald-700"
                      style={{
                        height: `${Math.max(
                          (item.income / maxAmount) * 100,
                          8
                        )}%`,
                      }}
                    />

                    <div
                      className="flex-1 rounded-t-md bg-black/10"
                      style={{
                        height: `${Math.max(
                          (item.expense / maxAmount) * 100,
                          8
                        )}%`,
                      }}
                    />
                  </div>

                  <span className="text-[11px] font-bold text-[#565e74]">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
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
  tone: "green" | "red" | "blue";
}) {
  const cls =
    tone === "green"
      ? "text-emerald-700"
      : tone === "red"
      ? "text-red-600"
      : "text-indigo-700";

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <h3 className={`text-xl font-bold ${cls}`}>{value}</h3>

      <p className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold ${cls}`}>
        {icon}
        {helper}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold text-black">
      <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}