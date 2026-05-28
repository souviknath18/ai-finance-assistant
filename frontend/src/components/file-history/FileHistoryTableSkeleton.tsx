export default function FileHistoryTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-[#eff4ff]/70">
            {["File Name", "Type", "Upload Date", "Status", "Extraction", "Actions"].map(
              (head) => (
                <th
                  key={head}
                  className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5eeff]">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-5 py-4">
                <div className="mb-2 h-3 w-44 rounded bg-[#e5eeff]" />
                <div className="h-2.5 w-20 rounded bg-[#eff4ff]" />
              </td>
              <td className="px-5 py-4">
                <div className="h-6 w-16 rounded-full bg-[#e5eeff]" />
              </td>
              <td className="px-5 py-4">
                <div className="mb-2 h-3 w-24 rounded bg-[#e5eeff]" />
                <div className="h-2.5 w-16 rounded bg-[#eff4ff]" />
              </td>
              <td className="px-5 py-4">
                <div className="h-3 w-24 rounded bg-[#e5eeff]" />
              </td>
              <td className="px-5 py-4">
                <div className="h-3 w-28 rounded bg-[#e5eeff]" />
              </td>
              <td className="px-5 py-4">
                <div className="ml-auto h-4 w-16 rounded bg-[#e5eeff]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}