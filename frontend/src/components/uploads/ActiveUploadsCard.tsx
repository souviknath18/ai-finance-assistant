import { Brain, FileText } from "lucide-react";
import ProgressItem from "./ProgressItem";
import { UploadedFile } from "@/types/upload";

type ActiveUploadsCardProps = {
  files: UploadedFile[];
};

export default function ActiveUploadsCard({ files }: ActiveUploadsCardProps) {
  if (files.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-black">Active Uploads</h3>
        <p className="mt-3 text-sm text-[#565e74]">
          No files are currently processing.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">Active Uploads</h3>

        <span className="rounded-full bg-[#e5eeff] px-4 py-1.5 text-xs font-bold text-black">
          {files.length} item{files.length > 1 ? "s" : ""} remaining
        </span>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <ProgressItem
            key={file.id}
            icon={
              file.status === "processing" ? (
                <Brain size={18} className="text-emerald-700" />
              ) : (
                <FileText size={18} />
              )
            }
            title={`${file.status === "processing" ? "AI Processing" : "Queued"} - ${
              file.original_filename
            }`}
            progress={file.status === "processing" ? "Analyzing..." : "Pending"}
            width={file.status === "processing" ? "45%" : "20%"}
            color={file.status === "processing" ? "bg-emerald-700" : "bg-black"}
            analyzing={file.status === "processing"}
          />
        ))}
      </div>
    </div>
  );
}