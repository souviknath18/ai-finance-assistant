import { InsightItem } from "@/types/insights";


type ObservationRowProps = {
  insight: InsightItem;
};


export default function ObservationRow({
  insight,
}: ObservationRowProps) {
  const title =
    insight.ai?.title ??
    insight.title;

  const description =
    insight.ai?.description ??
    insight.description;

  return (
    <tr className="transition hover:bg-[#fbfdff]">
      {/* Insight */}
      <td className="px-5 py-4 align-top">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-bold leading-5 text-black">
              {title}
            </p>

            <SeverityDot
              severity={insight.severity}
            />
          </div>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            {description}
          </p>

          {insight.ai?.recommendation && (
            <p className="mt-2 text-[11px] font-medium leading-5 text-[#8a92a5]">
              {insight.ai.recommendation}
            </p>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-5 py-4 align-top">
        <span className="inline-flex rounded-full border border-[#e5eeff] bg-[#eff4ff] px-2.5 py-1 text-[11px] font-bold text-black">
          {insight.category || "General"}
        </span>
      </td>

      {/* Impact */}
      <td className="px-5 py-4 align-top">
        <ImpactValue
          insight={insight}
        />
      </td>

      {/* Action */}
      <td className="px-5 py-4 align-top">
        {insight.action ? (
          <a
            href={insight.action.url}
            className="inline-flex rounded-lg border border-[#e5eeff] bg-white px-3 py-1.5 text-[11px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
          >
            {insight.action.label}
          </a>
        ) : (
          <span className="text-[11px] font-semibold text-[#8a92a5]">
            —
          </span>
        )}
      </td>
    </tr>
  );
}


function ImpactValue({
  insight,
}: {
  insight: InsightItem;
}) {
  const impact =
    insight.impact;

  if (!impact?.display) {
    return (
      <span className="text-[13px] font-bold text-[#565e74]">
        —
      </span>
    );
  }

  const className =
    insight.severity === "critical"
      ? "text-red-700"
      : insight.severity === "warning"
      ? "text-amber-700"
      : insight.severity === "positive"
      ? "text-emerald-700"
      : impact.direction === "down"
      ? "text-emerald-700"
      : impact.direction === "up"
      ? "text-red-700"
      : "text-[#565e74]";

  return (
    <span
      className={`text-[13px] font-bold ${className}`}
    >
      {impact.display}
    </span>
  );
}


function SeverityDot({
  severity,
}: {
  severity: InsightItem["severity"];
}) {
  const className =
    severity === "critical"
      ? "bg-red-600"
      : severity === "warning"
      ? "bg-amber-500"
      : severity === "positive"
      ? "bg-emerald-600"
      : "bg-[#9fb7d7]";

  return (
    <span
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${className}`}
      title={severity}
    />
  );
}