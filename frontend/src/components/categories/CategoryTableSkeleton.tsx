export default function CategoryTableSkeleton({
  rowsPerPage = 5,
}: {
  rowsPerPage?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-[#fbfcff]">
            <TableHead>
              Category
            </TableHead>

            <TableHead>
              Transactions
            </TableHead>

            <TableHead>
              Total Spending
            </TableHead>

            <TableHead>
              Income
            </TableHead>

            <TableHead align="right">
              Actions
            </TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#edf2fb]">
          {Array.from({
            length: rowsPerPage,
          }).map((_, index) => (
            <tr
              key={index}
              className="animate-pulse"
            >
              {/* Category */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-[#edf2fb]" />

                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded bg-[#e6edf9]" />
                    <div className="h-2 w-20 rounded bg-[#f1f4fa]" />
                  </div>
                </div>
              </td>

              {/* Transactions */}
              <td className="px-5 py-3.5">
                <div className="h-3 w-10 rounded bg-[#e6edf9]" />
              </td>

              {/* Spending */}
              <td className="px-5 py-3.5">
                <div className="h-3 w-24 rounded bg-[#e6edf9]" />
              </td>

              {/* Income */}
              <td className="px-5 py-3.5">
                <div className="h-3 w-24 rounded bg-[#e6edf9]" />
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <div className="h-8 w-8 rounded-lg bg-[#edf2fb]" />
                  <div className="h-8 w-8 rounded-lg bg-[#edf2fb]" />
                  <div className="h-8 w-8 rounded-lg bg-[#edf2fb]" />
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
      className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}