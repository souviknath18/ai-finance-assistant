type FileStatCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
  tone?: "green" | "muted";
  progress?: number;
  variant?: "default" | "highlight";
};

export default function FileStatCard({
  label,
  value,
  helper,
  icon,
  tone = "muted",
  progress,
  variant = "default",
}: FileStatCardProps) {
  const highlighted =
    variant === "highlight";

  const safeProgress =
    progress === undefined
      ? undefined
      : Math.min(
          Math.max(progress, 0),
          100
        );

  return (
    <div
      className={`rounded-3xl border p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] ${
        highlighted
          ? "border-emerald-100 bg-emerald-50/60"
          : "border-[#e6edf9] bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-[10px] font-bold uppercase tracking-wide ${
              highlighted
                ? "text-emerald-700"
                : "text-[#565e74]"
            }`}
          >
            {label}
          </p>

          <h2
            className={`mt-1.5 text-[22px] font-bold leading-none tracking-tight ${
              highlighted
                ? "text-emerald-700"
                : "text-black"
            }`}
          >
            {value}
          </h2>
        </div>

        {icon && (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              highlighted
                ? "border-emerald-100 bg-white text-emerald-700"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Progress */}
      {safeProgress !== undefined && (
        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
          <div
            className="h-full rounded-full bg-emerald-700 transition-[width] duration-500"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      )}

      {/* Helper */}
      {helper && (
        <p
          className={`mt-2.5 text-[11px] leading-5 ${
            tone === "green"
              ? "text-emerald-700"
              : highlighted
              ? "text-emerald-800"
              : "text-[#565e74]"
          }`}
        >
          {helper}
        </p>
      )}
    </div>
  );
}