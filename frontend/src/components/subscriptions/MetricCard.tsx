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
    <div className="flex h-full flex-col rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
        {label}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
        {value}
      </h2>

      <p
        className={`mt-auto flex items-center gap-1.5 pt-3 text-[12px] font-medium ${
          trendTone === "green"
            ? "text-emerald-700"
            : "text-[#565e74]"
        }`}
      >
        {icon}

        {trend}
      </p>
    </div>
  );
}