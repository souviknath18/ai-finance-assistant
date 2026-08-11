import TableHead from "./TableHead";

export default function TransactionTableSkeleton({
  rowsPerPage = 5,
}: {
  rowsPerPage?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#dfe9ff] bg-[#eff4ff]">
            <th className="w-[52px] p-4">
              <div className="h-4 w-4 animate-pulse rounded bg-[#dce9ff]" />
            </th>

            <TableHead>Date</TableHead>

            <TableHead>
              Description
            </TableHead>

            <TableHead>
              Category
            </TableHead>

            <TableHead align="right">
              Amount
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead align="center">
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
              {/* Select */}
              <td className="w-[52px] p-4">
                <div className="h-4 w-4 rounded bg-[#e5eeff]" />
              </td>

              {/* Date */}
              <td className="p-4">
                <div className="h-3 w-20 rounded bg-[#e5eeff]" />
              </td>

              {/* Description */}
              <td className="p-4">
                <div className="space-y-2">
                  <div className="h-3 w-44 rounded bg-[#e5eeff]" />

                  <div className="h-2.5 w-28 rounded bg-[#eff4ff]" />
                </div>
              </td>

              {/* Category */}
              <td className="p-4">
                <div className="h-7 w-24 rounded-full bg-[#e5eeff]" />
              </td>

              {/* Amount */}
              <td className="p-4">
                <div className="ml-auto h-3 w-20 rounded bg-[#e5eeff]" />
              </td>

              {/* Status */}
              <td className="p-4">
                <div className="h-7 w-28 rounded-full bg-[#e5eeff]" />
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex justify-center gap-1">
                  <div className="h-8 w-8 rounded-lg bg-[#e5eeff]" />

                  <div className="h-8 w-8 rounded-lg bg-[#e5eeff]" />

                  <div className="h-8 w-8 rounded-lg bg-[#e5eeff]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}