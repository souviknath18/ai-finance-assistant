import FileHistoryTabs from "./FileHistoryTabs";
import FileHistoryRow from "./FileHistoryRow";
import Pagination from "@/components/ui/Pagination";
import FileHistoryTableSkeleton from "./FileHistoryTableSkeleton";
import { UploadedFile, UploadStatus } from "@/types/upload";

type Props = {
  files: UploadedFile[];
  loading: boolean;
  statusFilter: "all" | UploadStatus;
  onStatusFilterChangeAction: (value: "all" | UploadStatus) => void;
  page: number;
  totalCount: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChangeAction: (value: number) => void;
  onDeleteAction: (file: UploadedFile) => void;
};

export default function FileHistoryTable({
  files,
  loading,
  statusFilter,
  onStatusFilterChangeAction,
  page,
  rowsPerPage,
  onRowsPerPageChangeAction,
  onDeleteAction,
  totalCount,
  totalPages,
  onPageChangeAction,
}: Props) {
  return (
    <div className="overflow-visible rounded-2xl border border-[#dce9ff] bg-white shadow-sm">
      <FileHistoryTabs
        statusFilter={statusFilter}
        onStatusFilterChangeAction={onStatusFilterChangeAction}
      />

      {loading ? (
        <FileHistoryTableSkeleton />
      ) : (
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
              {files.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-[13px] font-semibold text-[#565e74]"
                  >
                    No files found.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <FileHistoryRow
                    key={file.id}
                    file={file}
                    onDeleteAction={onDeleteAction}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        total={totalCount}
        currentPage={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        itemLabel="files"
        onPageChangeAction={onPageChangeAction}
        onRowsPerPageChangeAction={onRowsPerPageChangeAction}
      />
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