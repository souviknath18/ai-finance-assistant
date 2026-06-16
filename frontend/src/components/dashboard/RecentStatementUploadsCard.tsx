"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  Plus,
  UploadCloud,
  XCircle,
} from "lucide-react";

type RecentStatementUploadsCardProps = {
  uploads: {
    id: number;
    name: string;
    size: string;
    status: "pending" | "processing" | "success" | "failed";
    progress: number;
  }[];
};

function getStatusLabel(status: string) {
  if (status === "success") return "Completed";
  if (status === "processing") return "Processing";
  if (status === "pending") return "Pending";
  return "Failed";
}

function getProgress(status: string, progress: number) {
  if (status === "success") return 100;
  if (status === "failed") return 100;
  return Math.max(0, Math.min(progress || 0, 100));
}

export default function RecentStatementUploadsCard({
  uploads,
}: RecentStatementUploadsCardProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe5f5] bg-white shadow-sm">
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UploadCloud size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">Recent Uploads</h3>
            <p className="text-[12px] text-[#565e74]">
              Latest processed financial documents
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {uploads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fafdfb] p-5 text-center">
            <p className="text-[13px] font-bold text-black">No uploads yet</p>
            <p className="mt-1 text-[12px] text-[#565e74]">
              Upload a statement to start processing.
            </p>
          </div>
        ) : (
          uploads.map((file) => {
            const progress = getProgress(file.status, file.progress);

            return (
              <div
                key={file.id}
                className="rounded-2xl border border-[#e8eef8] bg-[#fafdfb] p-4 transition hover:border-emerald-100 hover:bg-white"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <FileText size={17} className="text-emerald-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-black">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#7c839b]">
                        {file.size}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-[11px] font-bold text-emerald-600">
                    {progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#e7edf8]">
                  <div
                    className={`relative h-full overflow-hidden rounded-full transition-all duration-700 ${
                      file.status === "success"
                        ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400"
                        : file.status === "failed"
                        ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                        : "bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent" />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      file.status === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : file.status === "failed"
                        ? "bg-red-50 text-red-600"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {getStatusLabel(file.status)}
                  </span>

                  {file.status === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  ) : file.status === "failed" ? (
                    <XCircle size={16} className="text-red-600" />
                  ) : (
                    <LoaderCircle
                      size={16}
                      className="animate-spin text-emerald-600"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-[#edf2fb] p-4">
        <button
          onClick={() => router.push("/uploads")}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c7d5ea] bg-[#fafdfb] text-[13px] font-bold text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Plus size={15} />
          Upload More Files
        </button>
      </div>
    </div>
  );
}