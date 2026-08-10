import ObservationRow from "./ObservationRow";

import { InsightItem } from "@/types/insights";

type ObservationTableProps = {
  observations: InsightItem[];
};

export default function ObservationTable({
  observations,
}: ObservationTableProps) {
  return (
    <section id="recent-observations" className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight text-black">
            Recent Observations
          </h2>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            Prioritized financial patterns, risks, and opportunities
            detected by Aura.
          </p>
        </div>

        {observations.length > 0 && (
          <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#e6edf9] bg-[#fbfcff] px-3 py-1.5 text-[10px] font-bold text-[#565e74]">
            {observations.length}{" "}
            {observations.length === 1
              ? "Insight"
              : "Insights"}
          </span>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:block">
        {observations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-[#edf2fb] bg-[#fbfcff]">
                <tr>
                  <TableHead>Insight</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf2fb]">
                {observations.map((item) => (
                  <ObservationRow
                    key={item.id}
                    insight={item}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {observations.length === 0 ? (
          <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
            <EmptyState />
          </div>
        ) : (
          observations.map((item) => (
            <ObservationMobileCard
              key={item.id}
              insight={item}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
        ✨
      </div>

      <p className="text-[13px] font-bold text-black">
        No observations yet
      </p>

      <p className="mt-1.5 max-w-sm text-[12px] leading-5 text-[#565e74]">
        Upload more financial transactions and Aura will detect
        spending patterns, budget risks, unusual activity,
        recurring expenses, and saving opportunities.
      </p>
    </div>
  );
}

function ObservationMobileCard({
  insight,
}: {
  insight: InsightItem;
}) {
  const title =
    insight.ai?.title ??
    insight.title;

  const description =
    insight.ai?.description ??
    insight.description;

  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-5 text-black">
            {title}
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            {description}
          </p>

          {insight.ai?.recommendation && (
            <p className="mt-2 text-[11px] leading-5 text-[#7c839b]">
              {insight.ai.recommendation}
            </p>
          )}
        </div>

        <SeverityBadge
          severity={insight.severity}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {insight.category && (
          <span className="rounded-full border border-[#e8eefb] bg-[#fbfcff] px-2.5 py-1 text-[10px] font-bold text-black">
            {insight.category}
          </span>
        )}

        {insight.impact?.display && (
          <span className="rounded-full border border-[#e8eefb] bg-white px-2.5 py-1 text-[10px] font-bold text-[#565e74]">
            {insight.impact.display}
          </span>
        )}
      </div>

      {insight.action && (
        <a
          href={insight.action.url}
          className="mt-4 inline-flex rounded-xl border border-[#e6edf9] bg-white px-3 py-2 text-[11px] font-bold text-black transition hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
        >
          {insight.action.label}
        </a>
      )}
    </div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: InsightItem["severity"];
}) {
  const className =
    severity === "critical"
      ? "border-red-100 bg-red-50 text-red-700"
      : severity === "warning"
      ? "border-amber-100 bg-amber-50 text-amber-700"
      : severity === "positive"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-[#e8eefb] bg-[#fbfcff] text-[#565e74]";

  const label =
    severity === "critical"
      ? "Critical"
      : severity === "warning"
      ? "Warning"
      : severity === "positive"
      ? "Positive"
      : "Info";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}