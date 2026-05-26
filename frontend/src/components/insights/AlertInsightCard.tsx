type AlertInsightCardProps = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  tone: "red" | "green";
};

export default function AlertInsightCard({
  icon,
  tag,
  title,
  description,
  tone,
}: AlertInsightCardProps) {
  const border =
    tone === "red" ? "border-l-red-600" : "border-l-emerald-700";

  const iconClass =
    tone === "red"
      ? "bg-red-50 text-red-700"
      : "bg-emerald-50 text-emerald-700";

  return (
    <div
      className={`flex-1 rounded-2xl border-l-4 ${border} bg-white p-5 shadow-sm`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${iconClass}`}>{icon}</div>

        <span className="text-[11px] font-semibold text-[#565e74]">
          {tag}
        </span>
      </div>

      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-black">
        {title}
      </p>

      <p className="text-[13px] leading-5 text-[#565e74]">{description}</p>
    </div>
  );
}