import { AlertTriangle, RefreshCcw } from "lucide-react";
import { UploadedFile } from "@/types/upload";
import { retryUploadProcessing } from "@/lib/api/uploadApi";

type IssuesFoundCardProps = {
  files: UploadedFile[];
  onRetryAction: () => void;
};

export default function IssuesFoundCard({
  files,
  onRetryAction,
}: IssuesFoundCardProps) {
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

      {files.length === 0 ? (
        <p className="text-[13px] text-[#565e74]">No upload issues found.</p>
      ) : (
        <div className="space-y-2.5">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-xl border border-red-100 bg-red-50 p-3.5"
            >
              <p className="text-[13px] font-bold text-red-600">
                {file.original_filename}
              </p>

              <p className="mt-1 text-[13px] leading-5 text-red-700">
                {file.error_message || "Processing failed."}
              </p>

              <button
                onClick={() => handleRetry(file.id)}
                className="mt-3 flex items-center gap-2 text-[13px] font-bold text-red-600"
              >
                <RefreshCcw size={14} />
                Retry
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}