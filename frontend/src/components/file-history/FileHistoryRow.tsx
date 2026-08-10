import {
  CheckCircle2,
  FileText,
  Image,
  LoaderCircle,
  RefreshCcw,
  Table,
  Trash2,
  XCircle,
} from "lucide-react";

import { UploadedFile } from "@/types/upload";

type Props = {
  file: UploadedFile;
  retrying: boolean;

  onRetryAction: (
    file: UploadedFile
  ) => Promise<void>;

  onDeleteAction: (
    file: UploadedFile
  ) => void;
};

export default function FileHistoryRow({
  file,
  retrying,
  onRetryAction,
  onDeleteAction,
}: Props) {
  const FileIcon =
    file.file_type === "csv"
      ? Table
      : file.file_type === "image"
      ? Image
      : FileText;

  const isSuccess =
    file.status === "success";

  const isPending =
    file.status === "pending" ||
    file.status === "processing";

  const isFailed =
    file.status === "failed";

  const uploadDate = new Date(
    file.uploaded_at
  );

  const statusLabel = isSuccess
    ? "Success"
    : isFailed
    ? "Failed"
    : file.status === "processing"
    ? "Processing"
    : "Pending";

  const itemLabel =
    file.extracted_transactions_count ===
    1
      ? "Item"
      : "Items";

  const extractionText =
    isPending
      ? file.processing_step ||
        "Waiting for processing"
      : `${file.extracted_transactions_count} ${itemLabel}`;

  const fileSize =
    typeof file.file_size_mb ===
    "number"
      ? `${file.file_size_mb.toFixed(
          2
        )} MB`
      : "Size unavailable";

  const processingProgress =
    Math.min(
      Math.max(
        file.processing_progress ||
          0,
        0
      ),
      100
    );

  const handleRetryClick =
    async () => {
      if (
        !isFailed ||
        retrying
      ) {
        return;
      }

      await onRetryAction(file);
    };

  return (
    <tr className="transition-[background-color] duration-200 hover:bg-[#fbfcff]">
      {/* File */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-[#f8f9ff] text-[#565e74]">
            <FileIcon size={17} />
          </div>

          <div className="min-w-0">
            <p
              className="max-w-[260px] truncate text-[13px] font-bold text-black"
              title={
                file.original_filename
              }
            >
              {
                file.original_filename
              }
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-[#565e74]">
              {fileSize}
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#8a92a5]">
              {file.upload_id}
            </p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-5 py-4">
        <span className="inline-flex rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#565e74]">
          {file.file_type}
        </span>
      </td>

      {/* Date */}
      <td className="px-5 py-4">
        <p className="text-[12px] font-medium text-black">
          {uploadDate.toLocaleDateString(
            "en-IN",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}
        </p>

        <p className="mt-0.5 text-[10px] font-medium text-[#7c839b]">
          {uploadDate.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge
          isSuccess={isSuccess}
          isPending={isPending}
          isFailed={isFailed}
          statusLabel={statusLabel}
        />

        {isPending && (
          <div className="mt-2 w-32">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#edf2fb]">
              <div
                className="h-full rounded-full bg-emerald-700 transition-[width] duration-500"
                style={{
                  width: `${processingProgress}%`,
                }}
              />
            </div>

            <p className="mt-1 text-[9px] font-medium text-[#7c839b]">
              {processingProgress}%
            </p>
          </div>
        )}
      </td>

      {/* Extraction */}
      <td className="px-5 py-4">
        <p
          className={`max-w-[220px] text-[12px] font-bold ${
            isFailed
              ? "text-red-600"
              : isPending
              ? "text-[#565e74]"
              : "text-black"
          }`}
        >
          {extractionText}
        </p>

        {isFailed &&
          file.error_message && (
            <p
              className="mt-1 max-w-[230px] truncate text-[10px] font-medium text-red-500"
              title={
                file.error_message
              }
            >
              {
                file.error_message
              }
            </p>
          )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          {isFailed && (
            <button
              type="button"
              disabled={retrying}
              onClick={
                handleRetryClick
              }
              aria-label={`Retry processing ${file.original_filename}`}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw
                size={14}
                className={
                  retrying
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          )}

          <button
            type="button"
            disabled={retrying}
            onClick={() =>
              onDeleteAction(file)
            }
            aria-label={`Delete ${file.original_filename}`}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 transition-[background-color,border-color] hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({
  isSuccess,
  isPending,
  isFailed,
  statusLabel,
}: {
  isSuccess: boolean;
  isPending: boolean;
  isFailed: boolean;
  statusLabel: string;
}) {
  const styles = isSuccess
    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
    : isFailed
    ? "border-red-100 bg-red-50 text-red-600"
    : "border-[#e6edf9] bg-[#f3f6fc] text-[#565e74]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${styles}`}
    >
      {isSuccess && (
        <CheckCircle2 size={12} />
      )}

      {isPending && (
        <LoaderCircle
          size={12}
          className="animate-spin"
        />
      )}

      {isFailed && (
        <XCircle size={12} />
      )}

      {statusLabel}
    </span>
  );
}