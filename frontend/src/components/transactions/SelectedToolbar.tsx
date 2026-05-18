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
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
          {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
        </span>

        <div className="hidden h-5 w-px bg-[#c6c6cd] sm:block" />

        <button className="text-xs font-bold uppercase tracking-wide text-emerald-700 hover:underline">
          Bulk Categorize
        </button>

        <button
          onClick={onDeleteSelectedAction}
          className="text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
        >
          Delete Selected
        </button>
      </div>

      <button onClick={onClearAction} className="text-[#565e74] hover:text-black">
        <X size={18} />
      </button>
    </div>
  );
}