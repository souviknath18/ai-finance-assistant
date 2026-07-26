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
  totalUploads: number;
};

type UploadStatus =
  RecentStatementUploadsCardProps["uploads"][number]["status"];

function getStatusDetails(status: UploadStatus) {
  switch (status) {
    case "success":
      return {
        label: "Completed",
        badge:
          "border-emerald-100 bg-emerald-50 text-emerald-700",
        iconColor: "text-emerald-600",
        Icon: CheckCircle2,
      };

    case "failed":
      return {
        label: "Failed",
        badge: "border-red-100 bg-red-50 text-red-600",
        iconColor: "text-red-600",
        Icon: XCircle,
      };

    case "processing":
      return {
        label: "Processing",
        badge: "border-indigo-100 bg-indigo-50 text-indigo-700",
        iconColor: "text-indigo-600",
        Icon: LoaderCircle,
      };

    default:
      return {
        label: "Pending",
        badge: "border-amber-100 bg-amber-50 text-amber-700",
        iconColor: "text-amber-600",
        Icon: LoaderCircle,
      };
  }
}

export default function RecentStatementUploadsCard({
  uploads,
  totalUploads,
}: RecentStatementUploadsCardProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <UploadCloud size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              Recent Uploads
            </h3>

            <p className="text-[12px] text-[#565e74]">
              Latest processed financial documents
            </p>
          </div>
        </div>
      </div>

      {/* Upload list */}
      <div className="space-y-2.5 p-4 sm:p-5">
        {uploads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#edf2fb] bg-white text-emerald-700">
              <UploadCloud size={19} />
            </div>

            <p className="text-[13px] font-bold text-black">
              No uploads yet
            </p>

            <p className="mt-1 text-[12px] text-[#565e74]">
              Upload a statement to start processing.
            </p>
          </div>
        ) : (
          uploads.map((file) => {
            const {
              label,
              badge,
              iconColor,
              Icon,
            } = getStatusDetails(file.status);

            const isLoading =
              file.status === "pending" ||
              file.status === "processing";

            return (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#e8eefb] bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow] duration-200 hover:border-emerald-200 hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)]"
              >
                {/* Left */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                    <FileText size={15} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="truncate text-[12px] font-bold text-black"
                      title={file.name}
                    >
                      {file.name}
                    </p>

                    <p className="text-[11px] text-[#7c839b]">
                      {file.size}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge}`}
                  >
                    {label}
                  </span>

                  <Icon
                    size={15}
                    className={`${iconColor} ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
        {totalUploads > uploads.length && (
          <p className="px-5 text-center text-[11px] text-[#7c839b]">
            Showing latest {uploads.length} of {totalUploads} uploads
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#edf2fb] p-4">
        <button
          type="button"
          onClick={() => router.push("/uploads")}
          className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-dashed border-[#c7d5ea] bg-[#fbfcff] px-4 text-[13px] font-bold text-[#565e74] transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_6px_16px_rgba(15,23,42,0.05)]"
        >
          <Plus size={15} className="shrink-0" />
          <span>Upload More Files</span>
        </button>
      </div>
    </div>
  );
}