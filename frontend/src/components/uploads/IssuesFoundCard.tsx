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
    <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <AlertTriangle size={20} className="text-red-600" />
        <h3 className="text-2xl font-bold text-black">Issues Found</h3>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-[#565e74]">No upload issues found.</p>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-2xl border border-red-100 bg-red-50 p-4"
            >
              <p className="font-bold text-red-600">
                {file.original_filename}
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {file.error_message || "Processing failed."}
              </p>

              <button
                onClick={() => handleRetry(file.id)}
                className="mt-3 flex items-center gap-2 text-sm font-bold text-red-600"
              >
                <RefreshCcw size={15} />
                Retry
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}