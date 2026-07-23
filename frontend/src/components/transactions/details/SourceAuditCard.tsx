import { ExternalLink, FileText } from "lucide-react";
import type { TransactionDetails } from "@/types/transaction";

type SourceAuditCardProps = {
  source: TransactionDetails["source"];
  rawText: string | null;
};

export default function SourceAuditCard({
  source,
  rawText,
}: SourceAuditCardProps) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        Source & Audit Trail
      </h3>

      <div className="space-y-4">
        <button
          type="button"
          disabled={!source}
          className="flex w-full flex-col gap-3 rounded-2xl border border-[#dbe5f2] p-4 text-left transition hover:bg-[#eff4ff] disabled:cursor-default disabled:hover:bg-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff] text-black">
              <FileText size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-black">
                {source?.filename ?? "Manual Transaction"}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
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
            <ExternalLink
              size={17}
              className="shrink-0 self-end text-[#565e74] sm:self-auto"
            />
          )}
        </button>

        <div className="rounded-2xl bg-[#eff4ff] p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Original Transaction String
          </p>

          <div className="overflow-x-auto">
            <code className="inline-block min-w-max rounded-lg bg-white px-3 py-2 text-[12px] text-black">
              {rawText ?? "No raw transaction text available."}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}