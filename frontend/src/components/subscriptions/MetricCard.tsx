type MetricCardProps = {
  label: string;
  value: string;
  trend: string;
  icon?: React.ReactNode;
  trendTone?: "green" | "muted";
};

export default function MetricCard({
  label,
  value,
  trend,
  icon,
  trendTone = "muted",
}: MetricCardProps) {
  return (
    <div className="flex min-h-[145px] flex-col rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            {label}
          </p>

          <h2
            title={value}
            className="mt-1.5 truncate text-[21px] font-bold tracking-tight text-black"
          >
            {value}
          </h2>
        </div>

        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            {icon}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#edf2fb] pt-2.5">
        <p
          className={`flex items-center gap-1.5 text-[10px] font-semibold leading-5 ${
            trendTone === "green"
              ? "text-emerald-700"
              : "text-[#7c839b]"
          }`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}