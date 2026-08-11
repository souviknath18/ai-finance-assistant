"use client";

import {
  AlertTriangle,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";

import { useState } from "react";

import type {
  UploadedFile,
} from "@/types/upload";

import {
  retryUploadProcessing,
} from "@/lib/api/uploadApi";

type IssuesFoundCardProps = {
  files: UploadedFile[];
  onRetryAction: () => void;
};

function getFriendlyProcessingError(
  error?: string | null
) {
  const message = String(
    error || ""
  ).toLowerCase();

  if (!message) {
    return "We could not process this file. Please try uploading a clearer or supported file.";
  }

  if (
    message.includes(
      "unsupported"
    ) ||
    message.includes(
      "file type"
    )
  ) {
    return "This file format could not be processed. Please upload a PDF, CSV, JPG, JPEG, or PNG file.";
  }

  if (
    message.includes(
      "no transactions"
    ) ||
    message.includes(
      "transactions"
    )
  ) {
    return "We could not find any valid transactions in this file. Please upload a bank statement or transaction CSV.";
  }

  if (
    message.includes("ocr") ||
    message.includes("image")
  ) {
    return "Image processing is not fully available yet. Please upload a PDF or CSV for better results.";
  }

  if (
    message.includes("pdf") ||
    message.includes("text")
  ) {
    return "We could not read this PDF properly. Please upload a digital PDF instead of a scanned or password-protected file.";
  }

  if (
    message.includes("csv") ||
    message.includes(
      "columns"
    )
  ) {
    return "We could not read this CSV format. Please make sure it includes transaction date, description, and amount columns.";
  }

  if (
    message.includes(
      "too long"
    )
  ) {
    return "This upload took too long to process. Please try again.";
  }

  return "We could not process this file. Please check the file quality and try again.";
}

export default function IssuesFoundCard({
  files,
  onRetryAction,
}: IssuesFoundCardProps) {
  const [
    retrying,
    setRetrying,
  ] = useState(false);

  const latestFailedFile =
    files[0];

  const handleRetry =
    async (id: number) => {
      try {
        setRetrying(true);

        await retryUploadProcessing(
          id
        );

        onRetryAction();
      } finally {
        setRetrying(false);
      }
    };

  return (
    <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600">
          <AlertTriangle
            size={16}
          />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-500">
            Upload Alert
          </p>

          <h3 className="mt-1 text-[16px] font-bold tracking-tight text-black">
            Issues Found
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#76777d]">
            Aura detected a problem while
            processing your latest file.
          </p>
        </div>
      </div>

      {!latestFailedFile ? (
        <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] px-4 py-7 text-center">
          <p className="text-[12px] font-bold text-black">
            No upload issues
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#76777d]">
            Failed upload details will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
          <p
            title={
              latestFailedFile.original_filename
            }
            className="truncate text-[12px] font-bold text-red-700"
          >
            {
              latestFailedFile.original_filename
            }
          </p>

          <p className="mt-2 text-[11px] leading-5 text-red-700">
            {getFriendlyProcessingError(
              latestFailedFile.error_message
            )}
          </p>

          <button
            type="button"
            disabled={retrying}
            onClick={() =>
              handleRetry(
                latestFailedFile.id
              )
            }
            className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 text-[11px] font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {retrying ? (
              <>
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCcw
                  size={13}
                />
                Retry Processing
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}