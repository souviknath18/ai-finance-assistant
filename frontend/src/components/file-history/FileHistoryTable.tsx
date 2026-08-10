import FileHistoryTabs from "./FileHistoryTabs";
import FileHistoryRow from "./FileHistoryRow";
import FileHistoryTableSkeleton from "./FileHistoryTableSkeleton";

import Pagination from "@/components/ui/Pagination";

import {
  UploadedFile,
  UploadStatus,
} from "@/types/upload";

type Props = {
  files: UploadedFile[];
  loading: boolean;

  statusFilter: "all" | UploadStatus;

  onStatusFilterChangeAction: (
    value: "all" | UploadStatus
  ) => void;

  page: number;
  rowsPerPage: number;
  totalCount: number;
  totalPages: number;

  retryingId: number | null;

  onPageChangeAction: (
    page: number
  ) => void;

  onRowsPerPageChangeAction: (
    value: number
  ) => void;

  onRetryAction: (
    file: UploadedFile
  ) => Promise<void>;

  onDeleteAction: (
    file: UploadedFile
  ) => void;
};

export default function FileHistoryTable({
  files,
  loading,
  statusFilter,
  onStatusFilterChangeAction,
  page,
  rowsPerPage,
  totalCount,
  totalPages,
  retryingId,
  onPageChangeAction,
  onRowsPerPageChangeAction,
  onRetryAction,
  onDeleteAction,
}: Props) {
  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <FileHistoryTabs
        statusFilter={statusFilter}
        onStatusFilterChangeAction={
          onStatusFilterChangeAction
        }
      />

      {loading ? (
        <FileHistoryTableSkeleton
          rowsPerPage={rowsPerPage}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#fbfcff]">
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

            <tbody className="divide-y divide-[#edf2fb]">
              {files.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-[13px] font-bold text-black">
                      No files found
                    </p>

                    <p className="mt-1 text-[12px] text-[#565e74]">
                      Upload a financial document or select a different status.
                    </p>
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <FileHistoryRow
                    key={file.id}
                    file={file}
                    retrying={
                      retryingId === file.id
                    }
                    onRetryAction={
                      onRetryAction
                    }
                    onDeleteAction={
                      onDeleteAction
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-[#edf2fb] bg-[#fbfcff]">
        <Pagination
          total={totalCount}
          currentPage={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          itemLabel="files"
          onPageChangeAction={
            onPageChangeAction
          }
          onRowsPerPageChangeAction={
            onRowsPerPageChangeAction
          }
        />
      </div>
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