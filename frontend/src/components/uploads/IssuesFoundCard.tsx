import { AlertTriangle, RefreshCcw } from "lucide-react";
import { UploadedFile } from "@/types/upload";
import { retryUploadProcessing } from "@/lib/api/uploadApi";

type IssuesFoundCardProps = {
  files: UploadedFile[];
  onRetryAction: () => void;
};

function getFriendlyProcessingError(error?: string | null) {
  const message = String(error || "").toLowerCase();

  if (!message) {
    return "We could not process this file. Please try uploading a clearer or supported file.";
  }

  if (message.includes("unsupported") || message.includes("file type")) {
    return "This file format could not be processed. Please upload a PDF, CSV, JPG, JPEG, or PNG file.";
  }

  if (message.includes("no transactions") || message.includes("transactions")) {
    return "We could not find any valid transactions in this file. Please upload a bank statement or transaction CSV.";
  }

  if (message.includes("ocr") || message.includes("image")) {
    return "Image processing is not fully available yet. Please upload a PDF or CSV for better results.";
  }

  if (message.includes("pdf") || message.includes("text")) {
    return "We could not read this PDF properly. Please upload a digital PDF instead of a scanned or password-protected file.";
  }

  if (message.includes("csv") || message.includes("columns")) {
    return "We could not read this CSV format. Please make sure it includes transaction date, description, and amount columns.";
  }

  return "We could not process this file. Please check the file quality and try again.";
}

export default function IssuesFoundCard({
  files,
  onRetryAction,
}: IssuesFoundCardProps) {
  const latestFailedFile = files[0];

  const handleRetry = async (id: number) => {
    await retryUploadProcessing(id);
    onRetryAction();
  };

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={18} className="text-red-600" />
        <h3 className="text-lg font-bold text-black">Issues Found</h3>
      </div>

      {!latestFailedFile ? (
        <p className="text-[13px] text-[#565e74]">No upload issues found.</p>
      ) : (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3.5">
          <p className="text-[13px] font-bold text-red-600">
            {latestFailedFile.original_filename}
          </p>

          <p className="mt-1 text-[13px] leading-5 text-red-700">
            {getFriendlyProcessingError(latestFailedFile.error_message)}
          </p>

          <button
            onClick={() => handleRetry(latestFailedFile.id)}
            className="mt-3 flex items-center gap-2 text-[13px] font-bold text-red-600"
          >
            <RefreshCcw size={14} />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}