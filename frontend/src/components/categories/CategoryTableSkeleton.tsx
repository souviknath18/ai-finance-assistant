export default function CategoryTableSkeleton({
  rowsPerPage = 5,
}: {
  rowsPerPage?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-[#eff4ff]">
            <th className="w-12 px-5 py-3.5">
              <div className="h-4 w-4 rounded bg-[#dce9ff]" />
            </th>

            <TableHead>Category</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Total Spending</TableHead>
            <TableHead>Income</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5eeff]">
          {Array.from({ length: rowsPerPage }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-5 py-4">
                <div className="h-4 w-4 rounded bg-[#e5eeff]" />
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#e5eeff]" />
                  <div className="h-4 w-28 rounded bg-[#e5eeff]" />
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="h-3 w-10 rounded bg-[#e5eeff]" />
              </td>

              <td className="px-5 py-4">
                <div className="h-3 w-24 rounded bg-[#e5eeff]" />
              </td>

              <td className="px-5 py-4">
                <div className="h-3 w-24 rounded bg-[#e5eeff]" />
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-2 opacity-70">
                  <div className="h-[27px] w-[27px] rounded-lg bg-[#e5eeff]" />
                  <div className="h-[27px] w-[27px] rounded-lg bg-[#e5eeff]" />
                  <div className="h-[27px] w-[27px] rounded-lg bg-[#e5eeff]" />
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
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}