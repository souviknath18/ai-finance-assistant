import {
  ExternalLink,
  FileText,
  PenLine,
} from "lucide-react";

import type {
  TransactionDetails,
} from "@/types/transaction";

type SourceAuditCardProps = {
  source: TransactionDetails["source"];
  rawText: string | null;
};

export default function SourceAuditCard({
  source,
  rawText,
}: SourceAuditCardProps) {
  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Audit Information
        </p>

        <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
          Source & Audit Trail
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
          Review where this transaction came from and the original extracted
          text used during processing.
        </p>
      </div>

      <div className="space-y-4">
        {/* Source */}
        <button
          type="button"
          disabled={!source}
          className="group flex w-full flex-col gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4 text-left transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#d5e2f3] hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)] disabled:cursor-default disabled:hover:border-[#edf2fb] disabled:hover:bg-[#fbfcff] disabled:hover:shadow-none sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                source
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-[#e6edf9] bg-white text-[#7c839b]"
              }`}
            >
              {source ? (
                <FileText size={17} />
              ) : (
                <PenLine size={17} />
              )}
            </div>

            <div className="min-w-0">
              <p
                className="truncate text-[12px] font-bold text-black"
                title={source?.filename ?? "Manual Transaction"}
              >
                {source?.filename ?? "Manual Transaction"}
              </p>

              <p className="mt-0.5 text-[10px] leading-5 text-[#76777d]">
                {source
                  ? `${source.fileType.toUpperCase()} • ${
                      source.processedAt
                        ? formatDate(source.processedAt)
                        : "Processed"
                    }`
                  : "This transaction was created manually."}
              </p>
            </div>
          </div>

          {source && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#7c839b] transition group-hover:bg-[#eff4ff] group-hover:text-black">
              <ExternalLink size={14} />
            </div>
          )}
        </button>

        {/* Raw text */}
        <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                Original Transaction String
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#8a92a5]">
                Raw text captured during document extraction.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e6edf9] bg-white">
            <code className="block min-w-max px-3.5 py-3 text-[11px] leading-5 text-[#0b1c30]">
              {rawText ?? "No raw transaction text available."}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}