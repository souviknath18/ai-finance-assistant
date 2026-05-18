import { ArrowUp, CheckCircle2 } from "lucide-react";

const bars = ["40%", "65%", "55%", "80%", "30%", "90%", "45%", "70%"];

export default function PerformanceCard() {
  return (
    <div className="relative z-0 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl md:col-span-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Q4 Financial Performance
          </h2>
          <p className="mt-1 text-sm text-[#565e74]">
            Oct 1 - Dec 31, 2023
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800">
          Status: Optimized
        </span>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Metric
          label="Total Income"
          value="$24,450.00"
          tone="green"
          helper="12% vs Q3"
          icon={<ArrowUp size={15} />}
        />

        <Metric
          label="Total Expenses"
          value="$18,210.00"
          tone="red"
          helper="4% vs Q3"
          icon={<ArrowUp size={15} />}
        />

        <Metric
          label="Net Savings"
          value="$6,240.00"
          tone="blue"
          helper="Target Reached"
          icon={<CheckCircle2 size={15} />}
        />
      </div>

      <div className="relative flex h-64 items-end overflow-hidden rounded-2xl bg-[#eff4ff] px-6 pb-6">
        <div className="flex h-full flex-1 items-end gap-3 pt-6">
          {bars.map((height, index) => (
            <div
              key={`${height}-${index}`}
              className={`flex-1 rounded-t-md ${
                index % 2 === 0 ? "bg-black/10" : "bg-emerald-700"
              }`}
              style={{ height }}
            />
          ))}
        </div>

        <div className="absolute right-6 top-6 space-y-2">
          <Legend color="bg-emerald-700" label="Income" />
          <Legend color="bg-black/10" label="Expenses" />
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
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>
      <h3 className={`text-2xl font-bold ${cls}`}>{value}</h3>
      <p className={`mt-2 flex items-center gap-1 text-xs font-bold ${cls}`}>
        {icon}
        {helper}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-black">
      <div className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </div>
  );
}