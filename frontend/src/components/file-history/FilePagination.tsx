import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FilePagination() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-[#dce9ff] bg-[#f8f9ff] px-6 py-4 md:flex-row">
      <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
        Showing 1 to 4 of 124 files
      </p>

      <div className="flex gap-2">
        <button
          disabled
          className="rounded-lg border border-[#c6c6cd] p-2 text-[#565e74] disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>

        <button className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white">
          1
        </button>

        <button className="rounded-lg px-3 py-2 text-xs font-bold text-black hover:bg-[#e5eeff]">
          2
        </button>

        <button className="rounded-lg px-3 py-2 text-xs font-bold text-black hover:bg-[#e5eeff]">
          3
        </button>

        <button className="rounded-lg border border-[#c6c6cd] p-2 text-black hover:bg-[#e5eeff]">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}