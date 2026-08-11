import {
  Brain,
  FileText,
} from "lucide-react";

import ProgressItem from "./ProgressItem";

import type {
  UploadedFile,
} from "@/types/upload";

type ActiveUploadsCardProps = {
  files: UploadedFile[];
};

export default function ActiveUploadsCard({
  files,
}: ActiveUploadsCardProps) {
  if (files.length === 0) {
    return (
      <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold tracking-tight text-black">
            Active Uploads
          </h2>
        </div>

        <p className="text-[11px] leading-5 text-[#76777d]">
          No files are currently processing.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Processing Queue
          </p>

          <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
            Active Uploads
          </h2>

          <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
            Track document upload and AI processing progress.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-[#dce9ff] bg-[#f8faff] px-2.5 py-1 text-[9px] font-bold text-[#565e74]">
          {files.length}{" "}
          {files.length === 1
            ? "item"
            : "items"}{" "}
          remaining
        </span>
      </div>

      {/* Upload Items */}
      <div className="space-y-3">
        {files.map((file) => {
          const completing =
            file.status ===
            "success";

          const isProcessing =
            file.status ===
            "processing";

          const titlePrefix =
            completing
              ? "Completed"
              : isProcessing
              ? "AI Processing"
              : "Queued";

          const progressText =
            completing
              ? "Finalizing..."
              : file.processing_step ||
                (isProcessing
                  ? "Processing..."
                  : "Pending");

          return (
            <ProgressItem
              key={file.id}
              icon={
                isProcessing ||
                completing ? (
                  <Brain
                    size={15}
                    className="text-emerald-700"
                  />
                ) : (
                  <FileText
                    size={15}
                    className="text-[#565e74]"
                  />
                )
              }
              title={`${titlePrefix} - ${file.original_filename}`}
              progress={
                progressText
              }
              width={`${Math.max(
                file.processing_progress ||
                  5,
                5
              )}%`}
              color={
                isProcessing ||
                completing
                  ? "bg-emerald-700"
                  : "bg-black"
              }
              analyzing={
                isProcessing
              }
              completing={
                completing
              }
            />
          );
        })}
      </div>
    </section>
  );
}