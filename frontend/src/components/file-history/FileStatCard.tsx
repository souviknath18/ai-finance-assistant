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
  const highlighted = variant === "highlight";

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlighted
          ? "border-emerald-200 bg-emerald-100"
          : "border-[#dce9ff] bg-white"
      }`}
    >
      <p
        className={`mb-1.5 text-[11px] font-bold uppercase tracking-wide ${
          highlighted ? "text-emerald-900" : "text-[#565e74]"
        }`}
      >
        {label}
      </p>

      <h2
        className={`text-xl font-bold ${
          highlighted ? "text-emerald-900" : "text-black"
        }`}
      >
        {value}
      </h2>

      {progress !== undefined && (
        <div className="mt-3.5 h-1.5 w-full rounded-full bg-[#e5eeff]">
          <div
            className="h-1.5 rounded-full bg-emerald-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {helper && (
        <p
          className={`mt-2.5 flex items-center gap-1 text-[11px] font-bold ${
            tone === "green"
              ? "text-emerald-700"
              : highlighted
              ? "text-emerald-900/80"
              : "text-[#565e74]"
          }`}
        >
          {icon}
          {helper}
        </p>
      )}
    </div>
  );
}