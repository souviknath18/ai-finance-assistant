"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import ParsedResult from "./ParsedResult";

import type {
  UploadedFile,
} from "@/types/upload";

type ParsedResultsCardProps = {
  files: UploadedFile[];
};

export default function ParsedResultsCard({
  files,
}: ParsedResultsCardProps) {
  const router = useRouter();

  const recentFiles =
    files.slice(0, 3);

  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Extraction Results
        </p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold tracking-tight text-black">
              Recent Parsed Results
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
              Recently processed documents and extracted transactions.
            </p>
          </div>

          {files.length > 0 && (
            <span className="shrink-0 rounded-full border border-[#dce9ff] bg-[#f8faff] px-2.5 py-1 text-[9px] font-bold text-[#565e74]">
              {files.length}
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {recentFiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] px-4 py-8 text-center">
          <p className="text-[12px] font-bold text-black">
            No parsed files yet
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#76777d]">
            Successfully processed uploads will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentFiles.map((file) => (
            <ParsedResult
              key={file.id}
              title={
                file.original_filename
              }
              subtitle={`${file.extracted_transactions_count} ${
                file.extracted_transactions_count === 1
                  ? "transaction"
                  : "transactions"
              } found`}
            />
          ))}
        </div>
      )}

      {/* Action */}
      <button
        type="button"
        onClick={() =>
          router.push("/history")
        }
        className="group mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[11px] font-bold text-black transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
      >
        Review All Results

        <ArrowRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </section>
  );
}