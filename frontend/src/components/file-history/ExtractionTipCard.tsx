import Link from "next/link";
import {
  Lightbulb,
} from "lucide-react";

export default function ExtractionTipCard() {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700">
          <Lightbulb size={17} />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Extraction Tip
          </p>

          <h2 className="mt-1 text-[15px] font-bold text-black">
            Improve Extraction Accuracy
          </h2>

          <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-[#565e74]">
            Upload original digital PDFs whenever possible. For images,
            use clear, high-resolution files where transaction dates,
            descriptions, and amounts are fully visible.
          </p>
        </div>
      </div>

      <Link
        href="/uploads"
        className="inline-flex h-10 w-fit shrink-0 items-center justify-center rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
      >
        Upload File
      </Link>
    </div>
  );
}