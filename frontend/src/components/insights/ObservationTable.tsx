import ObservationRow from "./ObservationRow";
import { InsightObservation } from "@/types/insights";

type ObservationTableProps = {
  observations: InsightObservation[];
};

export default function ObservationTable({
  observations,
}: ObservationTableProps) {
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-black">
            Recent Observations
          </h2>

          <p className="mt-1 text-[13px] leading-5 text-[#565e74]">
            Important patterns and financial events detected by Aura.
          </p>
        </div>

        {observations.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#eff4ff] px-3 py-1.5 text-[11px] font-bold text-[#565e74]">
            {observations.length}{" "}
            {observations.length === 1
              ? "Insight"
              : "Insights"}
          </span>
        )}
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e5eeff] bg-white shadow-sm">
        {observations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-[#e5eeff] bg-[#f8faff]">
                <tr>
                  <TableHead>Insight</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e5eeff]">
                {observations.map((item, index) => (
                  <ObservationRow
                    key={`${item.title}-${index}`}
                    title={item.title}
                    desc={item.description}
                    category={item.category}
                    impact={item.impact}
                    action={item.action}
                    neutral={item.tone === "neutral"}
                  />
                ))}
              </tbody>
            </table>
          </div>
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
    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#565e74]">
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4ff]">
        <span className="text-lg">✨</span>
      </div>

      <p className="text-[13px] font-bold text-black">
        No observations yet
      </p>

      <p className="mt-1.5 max-w-sm text-[12px] leading-5 text-[#565e74]">
        Upload more financial transactions and Aura will start detecting
        spending patterns, unusual activity, recurring expenses, and saving
        opportunities.
      </p>
    </div>
  );
}