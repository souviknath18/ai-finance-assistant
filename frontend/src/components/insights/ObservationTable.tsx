import ObservationRow from "./ObservationRow";
import { InsightObservation } from "@/types/insights";

type ObservationTableProps = {
  observations: InsightObservation[];
};

export default function ObservationTable({
  observations,
}: ObservationTableProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-black">
        Recent Observations
      </h2>

      <div className="overflow-hidden rounded-2xl border border-[#e5eeff] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-[#e5eeff] bg-[#eff4ff]">
              <tr>
                <TableHead>Insight</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5eeff]">
              {observations.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-6 text-[13px] font-semibold text-[#565e74]"
                  >
                    No observations yet. Upload more transactions to generate insights.
                  </td>
                </tr>
              ) : (
                observations.map((item, index) => (
                  <ObservationRow
                    key={`${item.title}-${index}`}
                    title={item.title}
                    desc={item.description}
                    category={item.category}
                    impact={item.impact}
                    action={item.action}
                    neutral={item.tone === "neutral"}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
      {children}
    </th>
  );
}