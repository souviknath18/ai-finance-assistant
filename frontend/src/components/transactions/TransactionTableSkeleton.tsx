import TableHead from "./TableHead";

export default function TransactionTableSkeleton({
  rowsPerPage = 5,
}: {
  rowsPerPage?: number;
}) {
  return (
    <div className="overflow-hidden rounded-t-2xl border border-0 border-b-0 bg-white shadow-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e8edf7] bg-[#f8f9ff]">
              <th className="w-12 p-4">
                <div className="h-4 w-4 rounded bg-[#dce9ff]" />
              </th>

              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead align="right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="center">Actions</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {Array.from({ length: rowsPerPage }).map((_, index) => (
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
                  <div className="flex items-center gap-2">
                    <div className="h-[15px] w-[15px] rounded-full bg-[#e5eeff]" />
                    <div className="h-3 w-20 rounded bg-[#e5eeff]" />
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2.5">
                    <div className="h-4 w-4 rounded bg-[#e5eeff]" />
                    <div className="h-4 w-4 rounded bg-[#e5eeff]" />
                    <div className="h-4 w-4 rounded bg-[#e5eeff]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}