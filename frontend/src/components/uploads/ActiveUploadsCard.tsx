import { Brain, FileText } from "lucide-react";
import ProgressItem from "./ProgressItem";
import { UploadedFile } from "@/types/upload";

type ActiveUploadsCardProps = {
  files: UploadedFile[];
};

export default function ActiveUploadsCard({ files }: ActiveUploadsCardProps) {
  if (files.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-black">Active Uploads</h3>
        <p className="mt-2 text-[13px] text-[#565e74]">
          No files are currently processing.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">Active Uploads</h3>

        <span className="rounded-full bg-[#e5eeff] px-3 py-1 text-[11px] font-bold text-black">
          {files.length} item{files.length > 1 ? "s" : ""} remaining
        </span>
      </div>

      <div className="space-y-3">
        {files.map((file) => {
          const completing = file.status === "success";

          const titlePrefix = completing
            ? "Completed"
            : file.status === "processing"
            ? "AI Processing"
            : "Queued";

          return (
            <ProgressItem
              key={file.id}
              icon={
                file.status === "processing" || completing ? (
                  <Brain size={16} className="text-emerald-700" />
                ) : (
                  <FileText size={16} />
                )
              }
              title={`${titlePrefix} - ${file.original_filename}`}
              progress={
                completing
                  ? "Finalizing..."
                  : file.processing_step ||
                    (file.status === "processing" ? "Processing..." : "Pending")
              }
              width={`${Math.max(file.processing_progress || 5, 5)}%`}
              color={
                file.status === "processing" || completing
                  ? "bg-emerald-700"
                  : "bg-black"
              }
              analyzing={file.status === "processing"}
              completing={completing}
            />
          );
        })}
      </div>
    </div>
  );
}