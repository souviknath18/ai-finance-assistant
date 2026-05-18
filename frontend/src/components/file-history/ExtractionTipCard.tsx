import { Lightbulb } from "lucide-react";

export default function ExtractionTipCard() {
  return (
    <div className="mt-8 flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-8 md:flex-row">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
        <Lightbulb size={30} />
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold text-black">
          Improve Extraction Accuracy
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#565e74]">
          Aura noticed that higher-resolution scans have a 15% higher success
          rate in categorizing complex bank statements. Try uploading original
          digital PDFs instead of scanned photos when possible.
        </p>
      </div>

      <button className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
        Learn More
      </button>
    </div>
  );
}