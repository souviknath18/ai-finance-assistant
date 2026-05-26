import { Lightbulb } from "lucide-react";

export default function ExtractionTipCard() {
  return (
    <div className="mt-6 flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-6 md:flex-row">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
        <Lightbulb size={22} />
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-bold text-black">
          Improve Extraction Accuracy
        </h2>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          Aura noticed that higher-resolution scans have a 15% higher success
          rate in categorizing complex bank statements. Try uploading original
          digital PDFs instead of scanned photos when possible.
        </p>
      </div>

      <button className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
        Learn More
      </button>
    </div>
  );
}