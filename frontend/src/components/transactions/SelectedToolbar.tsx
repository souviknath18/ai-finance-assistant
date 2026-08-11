import {
  CheckSquare,
  Tags,
  Trash2,
  X,
} from "lucide-react";

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
    <div className="mb-4 flex flex-col justify-between gap-3 rounded-2xl border border-[#dce9ff] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center">
      {/* LEFT */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff] text-black">
          <CheckSquare size={16} />
        </div>

        <div>
          <p className="text-[12px] font-bold text-black">
            {selectedCount}{" "}
            {selectedCount === 1 ? "transaction" : "transactions"} selected
          </p>

          <p className="mt-0.5 text-[10px] text-[#76777d]">
            Apply actions to the selected records.
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#dce9ff] bg-[#f8faff] px-3.5 text-[11px] font-bold text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Tags size={14} />
          Bulk Categorize
        </button>

        <button
          type="button"
          onClick={onDeleteSelectedAction}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 text-[11px] font-bold text-red-600 transition hover:border-red-200 hover:bg-red-100"
        >
          <Trash2 size={14} />
          Delete Selected
        </button>

        <div className="mx-1 hidden h-5 w-px bg-[#dce9ff] sm:block" />

        <button
          type="button"
          onClick={onClearAction}
          aria-label="Clear selection"
          title="Clear selection"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#76777d] transition hover:bg-[#eff4ff] hover:text-black"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}