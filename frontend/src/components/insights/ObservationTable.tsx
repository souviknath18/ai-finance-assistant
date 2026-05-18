import ObservationRow from "./ObservationRow";

export default function ObservationTable() {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold text-black">
        Recent Observations
      </h2>

      <div className="overflow-hidden rounded-3xl border border-[#e5eeff] bg-white shadow-sm">
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
              <ObservationRow
                title="Lower Insurance Rate Found"
                desc="Geico quote is 15% lower than current Progressive rate."
                category="Fixed Costs"
                impact="-₹24,000/yr"
                action="Compare"
              />

              <ObservationRow
                title="Unused Subscription"
                desc="No logins to Masterclass in 90 days."
                category="Lifestyle"
                impact="-₹1,500/mo"
                action="Cancel"
              />

              <ObservationRow
                title="Upcoming Large Bill"
                desc="Annual Amazon Prime renewal due next Tuesday."
                category="Recurring"
                impact="₹13,900"
                action="Prepare"
                neutral
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#565e74]">
      {children}
    </th>
  );
}