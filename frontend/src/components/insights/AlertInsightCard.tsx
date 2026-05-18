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
      className={`flex-1 rounded-3xl border-l-4 ${border} bg-white p-6 shadow-sm`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>

        <span className="text-xs font-semibold text-[#565e74]">
          {tag}
        </span>
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-black">
        {title}
      </p>

      <p className="text-sm leading-6 text-[#565e74]">{description}</p>
    </div>
  );
}