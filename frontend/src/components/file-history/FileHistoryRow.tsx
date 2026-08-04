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
    file.extracted_transactions_count === 1
      ? "Item"
      : "Items";

  const extractionText = isPending
    ? file.processing_step ||
      "Waiting for processing"
    : `${file.extracted_transactions_count} ${itemLabel}`;

  const fileSize =
    typeof file.file_size_mb === "number"
      ? `${file.file_size_mb.toFixed(2)} MB`
      : "Size unavailable";

  return (
    <tr className="transition hover:bg-[#eff4ff]/60">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff]">
            <FileIcon
              size={18}
              className="text-black"
            />
          </div>

          <div className="min-w-0">
            <p
              className="max-w-[260px] truncate text-[13px] font-bold text-black"
              title={
                file.original_filename
              }
            >
              {file.original_filename}
            </p>

            <p className="mt-0.5 text-[11px] font-semibold text-[#565e74]">
              {fileSize}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-[#7c839b]">
              {file.upload_id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="rounded-full bg-[#e5eeff] px-2.5 py-1 text-[11px] font-bold uppercase text-[#565e74]">
          {file.file_type}
        </span>
      </td>

      <td className="px-5 py-4">
        <p className="text-[13px] text-black">
          {uploadDate.toLocaleDateString(
            "en-IN",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}
        </p>

        <p className="text-[11px] font-semibold text-[#565e74]">
          {uploadDate.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>
      </td>

      <td className="px-5 py-4">
        <div
          className={`flex items-center gap-2 text-[13px] font-bold ${
            isSuccess
              ? "text-emerald-700"
              : isPending
              ? "text-[#7c839b]"
              : "text-red-600"
          }`}
        >
          {isSuccess && (
            <CheckCircle2 size={15} />
          )}

          {isPending && (
            <LoaderCircle
              size={15}
              className="animate-spin"
            />
          )}

          {isFailed && (
            <XCircle size={15} />
          )}

          {statusLabel}
        </div>

        {isPending && (
          <div className="mt-2 w-32">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
              <div
                className="h-full rounded-full bg-black transition-all duration-500"
                style={{
                  width: `${Math.min(
                    Math.max(
                      file.processing_progress ||
                        0,
                      0
                    ),
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-1 text-[10px] font-semibold text-[#7c839b]">
              {file.processing_progress || 0}%
            </p>
          </div>
        )}
      </td>

      <td className="px-5 py-4">
        <p
          className={`max-w-[220px] text-[13px] font-bold ${
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
              className="mt-1 max-w-[230px] truncate text-[11px] font-medium text-red-500"
              title={file.error_message}
            >
              {file.error_message}
            </p>
          )}
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          {isFailed && (
            <button
              type="button"
              disabled={retrying}
              onClick={() =>
                onRetryAction(file)
              }
              title="Retry processing"
              aria-label={`Retry processing ${file.original_filename}`}
              className="rounded-lg p-1.5 text-[#565e74] transition hover:bg-[#e5eeff] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw
                size={16}
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
            onClick={() =>
              onDeleteAction(file)
            }
            title="Delete file"
            aria-label={`Delete ${file.original_filename}`}
            className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}