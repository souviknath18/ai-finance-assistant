type BudgetCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  progress: number;
  badge?: string;
  warning?: string;
  tone?: "default" | "red";
  className?: string;
};

export default function BudgetCard({
  icon,
  title,
  subtitle,
  amount,
  progress,
  badge,
  warning,
  tone = "default",
  className = "",
}: BudgetCardProps) {
  const isRed = tone === "red";

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${
        isRed ? "border-red-100" : "border-[#e5eeff]"
      } ${className}`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            isRed ? "bg-red-50 text-red-600" : "bg-[#e5eeff] text-black"
          }`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isRed ? "bg-red-50 text-red-600" : "bg-[#e5eeff] text-[#565e74]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-black">{title}</h3>

      <p className="mb-5 mt-1 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {subtitle}
      </p>

      <div className="mt-auto">
        <div className="mb-2 flex items-end justify-between gap-3">
          <p
            className={`text-base font-bold ${
              isRed ? "text-red-600" : "text-black"
            }`}
          >
            {amount}
          </p>

          <span
            className={`text-[11px] font-bold ${
              isRed ? "text-red-600" : "text-[#565e74]"
            }`}
          >
            {progress}% used
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className={`h-full rounded-full ${
              isRed ? "bg-red-600" : "bg-emerald-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {warning && (
          <p className="mt-2.5 text-[13px] font-semibold text-red-600">
            {warning}
          </p>
        )}
      </div>
    </div>
  );
}