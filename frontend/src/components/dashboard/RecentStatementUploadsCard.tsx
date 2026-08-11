"use client";

import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  Plus,
  UploadCloud,
  XCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

type RecentStatementUploadsCardProps = {
  uploads: {
    id: number;
    name: string;
    size: string;
    status:
      | "pending"
      | "processing"
      | "success"
      | "failed";
    progress: number;
  }[];
  totalUploads: number;
};

type UploadStatus =
  RecentStatementUploadsCardProps["uploads"][number]["status"];

function getStatusDetails(
  status: UploadStatus
) {
  switch (status) {
    case "success":
      return {
        label: "Completed",
        badge:
          "border-emerald-100 bg-emerald-50 text-emerald-700",
        iconColor:
          "text-emerald-600",
        Icon: CheckCircle2,
      };

    case "failed":
      return {
        label: "Failed",
        badge:
          "border-red-100 bg-red-50 text-red-600",
        iconColor:
          "text-red-600",
        Icon: XCircle,
      };

    case "processing":
      return {
        label: "Processing",
        badge:
          "border-indigo-100 bg-indigo-50 text-indigo-700",
        iconColor:
          "text-indigo-600",
        Icon: LoaderCircle,
      };

    default:
      return {
        label: "Pending",
        badge:
          "border-amber-100 bg-amber-50 text-amber-700",
        iconColor:
          "text-amber-600",
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
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <UploadCloud size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              Recent Uploads
            </h3>

            <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
              Latest financial documents and processing status.
            </p>
          </div>
        </div>
      </div>

      {/* Upload List */}
      <div className="space-y-2.5 p-4 sm:p-5">
        {uploads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e6edf9] bg-white text-[#7c839b]">
              <UploadCloud size={17} />
            </div>

            <p className="mt-3 text-[13px] font-bold text-black">
              No uploads yet
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
              Upload a financial document to start processing.
            </p>
          </div>
        ) : (
          uploads.map((file) => {
            const {
              label,
              badge,
              iconColor,
              Icon,
            } = getStatusDetails(
              file.status
            );

            const isLoading =
              file.status ===
                "pending" ||
              file.status ===
                "processing";

            return (
              <div
                key={file.id}
                className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dce9ff] hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* File */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74]">
                      <FileText size={15} />
                    </div>

                    <div className="min-w-0">
                      <p
                        title={file.name}
                        className="truncate text-[11px] font-bold text-black"
                      >
                        {file.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#7c839b]">
                        {file.size}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${badge}`}
                    >
                      {label}
                    </span>

                    <Icon
                      size={13}
                      className={`${iconColor} ${
                        isLoading
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Progress */}
                {isLoading && (
                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              file.progress ||
                                5,
                              5
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {totalUploads >
          uploads.length &&
          uploads.length > 0 && (
            <p className="pt-1 text-center text-[10px] font-medium text-[#7c839b]">
              Showing latest{" "}
              {uploads.length} of{" "}
              {totalUploads} uploads
            </p>
          )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#edf2fb] p-4">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/uploads"
            )
          }
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c7d5ea] bg-[#fbfcff] px-4 text-[11px] font-bold text-[#565e74] transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
        >
          <Plus size={13} />
          Upload More Files
        </button>
      </div>
    </section>
  );
}