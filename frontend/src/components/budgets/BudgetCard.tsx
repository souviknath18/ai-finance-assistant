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
      className={`flex flex-col rounded-3xl border bg-white p-6 shadow-sm ${
        isRed ? "border-red-100" : "border-[#e5eeff]"
      } ${className}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isRed
              ? "bg-red-50 text-red-600"
              : "bg-[#e5eeff] text-black"
          }`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isRed
                ? "bg-red-50 text-red-600"
                : "bg-[#e5eeff] text-[#565e74]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-bold text-black">{title}</h3>

      <p className="mb-6 mt-1 text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {subtitle}
      </p>

      <div className="mt-auto">
        <div className="mb-2 flex items-end justify-between gap-3">
          <p
            className={`text-xl font-bold ${
              isRed ? "text-red-600" : "text-black"
            }`}
          >
            {amount}
          </p>

          <span
            className={`text-xs font-bold ${
              isRed ? "text-red-600" : "text-[#565e74]"
            }`}
          >
            {progress}% used
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className={`h-full rounded-full ${
              isRed ? "bg-red-600" : "bg-emerald-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {warning && (
          <p className="mt-3 text-sm font-semibold text-red-600">
            {warning}
          </p>
        )}
      </div>
    </div>
  );
}