export default function PreviousPaymentsCard() {
  return (
    <div>
      <h3 className="mb-5 text-2xl font-bold text-black">
        Previous Payments
      </h3>

      <div className="overflow-hidden rounded-3xl border border-[#e5eeff] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-[#eff4ff]">
              <tr>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5eeff]">
              {["Sept 24, 2024", "Aug 24, 2024"].map((date) => (
                <tr key={date} className="transition hover:bg-[#eff4ff]">
                  <td className="px-6 py-4 text-sm text-black">{date}</td>

                  <td className="px-6 py-4 text-sm text-black">
                    CloudScale AI Services
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-black">
                    -$299.00
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#565e74]">
      {children}
    </th>
  );
}