import { X } from "lucide-react";

type SelectedToolbarProps = {
  selectedCount: number;
  onClearAction: () => void;
  onDeleteSelectedAction: () => void;
};

export default function SelectedToolbar({
  selectedCount,
  onClearAction,
  onDeleteSelectedAction,
}: SelectedToolbarProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-800">
          {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
        </span>

        <div className="hidden h-4 w-px bg-[#c6c6cd] sm:block" />

        <button className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 hover:underline">
          Bulk Categorize
        </button>

        <button
          onClick={onDeleteSelectedAction}
          className="text-[11px] font-bold uppercase tracking-wide text-red-600 hover:underline"
        >
          Delete Selected
        </button>
      </div>

      <button onClick={onClearAction} className="text-[#565e74] hover:text-black">
        <X size={16} />
      </button>
    </div>
  );
}