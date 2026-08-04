export default function FileHistoryTableSkeleton({
  rowsPerPage = 5,
}: {
  rowsPerPage?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-[#eff4ff]/70">
            <TableHead>
              File Name
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Upload Date
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Extraction
            </TableHead>

            <TableHead align="right">
              Actions
            </TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5eeff]">
          {Array.from({
            length: rowsPerPage,
          }).map((_, index) => (
            <tr
              key={index}
              className="animate-pulse"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#e5eeff]" />

                  <div>
                    <div className="mb-2 h-3 w-44 rounded bg-[#e5eeff]" />
                    <div className="mb-1.5 h-2.5 w-20 rounded bg-[#eff4ff]" />
                    <div className="h-2 w-24 rounded bg-[#eff4ff]" />
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="h-[22px] w-14 rounded-full bg-[#e5eeff]" />
              </td>

              <td className="px-5 py-4">
                <div className="mb-2 h-3 w-24 rounded bg-[#e5eeff]" />
                <div className="h-2.5 w-16 rounded bg-[#eff4ff]" />
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-[15px] w-[15px] rounded-full bg-[#e5eeff]" />
                  <div className="h-3 w-16 rounded bg-[#e5eeff]" />
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="h-3 w-24 rounded bg-[#e5eeff]" />
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#e5eeff]" />
                  <div className="h-7 w-7 rounded-lg bg-[#e5eeff]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}