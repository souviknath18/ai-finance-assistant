import { Filter } from "lucide-react";

export default function FileHistoryTabs() {
  return (
    <div className="flex items-center justify-between border-b border-[#dce9ff] bg-[#f8f9ff] px-6 py-4">
      <div className="flex gap-6">
        <button className="border-b-2 border-black pb-1 text-xs font-bold uppercase tracking-wide text-black">
          All Files
        </button>

        <button className="pb-1 text-xs font-bold uppercase tracking-wide text-[#565e74] hover:text-black">
          Pending
        </button>

        <button className="pb-1 text-xs font-bold uppercase tracking-wide text-[#565e74] hover:text-black">
          Processed
        </button>
      </div>

      <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#565e74] hover:text-black">
        <Filter size={17} />
        Filters
      </button>
    </div>
  );
}