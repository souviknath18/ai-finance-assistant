export default function TransactionTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-t-2xl border border-0 border-b-0 bg-white shadow-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#c6c6cd] bg-[#f8f9ff]">
              {["", "Date", "Description", "Category", "Amount", "Status", "Actions"].map(
                (head) => (
                  <th key={head} className="p-4 text-[11px] font-bold uppercase text-[#565e74]">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="p-4">
                  <div className="h-4 w-4 rounded bg-[#e5eeff]" />
                </td>
                <td className="p-4">
                  <div className="h-3 w-20 rounded bg-[#e5eeff]" />
                </td>
                <td className="p-4">
                  <div className="mb-2 h-3 w-44 rounded bg-[#e5eeff]" />
                  <div className="h-2.5 w-28 rounded bg-[#eff4ff]" />
                </td>
                <td className="p-4">
                  <div className="h-6 w-24 rounded-full bg-[#e5eeff]" />
                </td>
                <td className="p-4">
                  <div className="ml-auto h-3 w-20 rounded bg-[#e5eeff]" />
                </td>
                <td className="p-4">
                  <div className="h-3 w-24 rounded bg-[#e5eeff]" />
                </td>
                <td className="p-4">
                  <div className="mx-auto h-4 w-20 rounded bg-[#e5eeff]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}