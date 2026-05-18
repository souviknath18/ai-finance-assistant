import FileHistoryTabs from "./FileHistoryTabs";
import FileHistoryRow from "./FileHistoryRow";
import FilePagination from "./FilePagination";

const files = [
  {
    name: "Chase_Statement_Aug2024.pdf",
    size: "4.2 MB",
    type: "PDF",
    date: "Aug 15, 2024",
    time: "10:45 AM",
    status: "Success",
    extraction: "142 Items",
    fileKind: "pdf",
  },
  {
    name: "Expenses_Export_Q2.csv",
    size: "1.8 MB",
    type: "CSV",
    date: "Aug 14, 2024",
    time: "02:30 PM",
    status: "Pending",
    extraction: "Processing...",
    fileKind: "csv",
  },
  {
    name: "Receipt_AppleStore_001.jpg",
    size: "850 KB",
    type: "Image",
    date: "Aug 12, 2024",
    time: "09:12 AM",
    status: "Failed",
    extraction: "0 Items",
    fileKind: "image",
  },
  {
    name: "Amex_Gold_July.pdf",
    size: "3.1 MB",
    type: "PDF",
    date: "Aug 10, 2024",
    time: "04:55 PM",
    status: "Success",
    extraction: "88 Items",
    fileKind: "pdf",
  },
];

export default function FileHistoryTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#dce9ff] bg-white shadow-sm">
      <FileHistoryTabs />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eff4ff]/70">
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Extraction</TableHead>
              <TableHead align="right">Actions</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {files.map((file) => (
              <FileHistoryRow key={file.name} file={file} />
            ))}
          </tbody>
        </table>
      </div>

      <FilePagination />
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
      className={`px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#565e74] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}