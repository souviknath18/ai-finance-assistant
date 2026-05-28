import {
  CheckCircle2,
  FileText,
  Image,
  RefreshCcw,
  Table,
  Trash2,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import { UploadedFile } from "@/types/upload";

export default function FileHistoryRow({
  file,
  onDeleteAction,
}: {
  file: UploadedFile;
  onDeleteAction: (file: UploadedFile) => void;
}) {
  const FileIcon =
    file.file_type === "csv" ? Table : file.file_type === "image" ? Image : FileText;

  const isSuccess = file.status === "success";
  const isPending = file.status === "pending" || file.status === "processing";
  const isFailed = file.status === "failed";

  const uploadDate = new Date(file.uploaded_at);

  const statusLabel = isSuccess
    ? "Success"
    : isFailed
    ? "Failed"
    : file.status === "processing"
    ? "Processing"
    : "Pending";

  const extraction = isSuccess
    ? `${file.extracted_transactions_count} Items`
    : isFailed
    ? "0 Items"
    : file.processing_step || "Processing...";

  return (
    <tr className="transition hover:bg-[#eff4ff]/60">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <FileIcon size={19} className="text-black" />

          <div>
            <p className="text-[13px] font-bold text-black">
              {file.original_filename}
            </p>
            <p className="text-[11px] font-semibold text-[#565e74]">
              {file.file_size_mb} MB
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
          {uploadDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-[11px] font-semibold text-[#565e74]">
          {uploadDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
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
          {isSuccess && <CheckCircle2 size={15} />}
          {isPending && <LoaderCircle size={15} className="animate-spin" />}
          {isFailed && <XCircle size={15} />}
          {statusLabel}
        </div>
      </td>

      <td className="px-5 py-4">
        <p
          className={`text-[13px] font-bold ${
            isFailed ? "text-red-600" : isPending ? "text-[#565e74]" : "text-black"
          }`}
        >
          {extraction}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button className="rounded-lg p-1.5 text-[#565e74] transition hover:bg-[#e5eeff] hover:text-black">
            <RefreshCcw size={16} />
          </button>

          <button
            onClick={() => onDeleteAction(file)}
            className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}