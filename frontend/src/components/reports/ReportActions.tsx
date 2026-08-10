import {
  Download,
  Share2,
} from "lucide-react";

type ReportActionsProps = {
  disabled: boolean;
  exporting: boolean;
  onExportPDFAction: () => void;
};

export default function ReportActions({
  disabled,
  exporting,
  onExportPDFAction,
}: ReportActionsProps) {
  return (
    <div className="mt-5 flex flex-wrap justify-end gap-2.5 rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
      <button
        type="button"
        onClick={
          onExportPDFAction
        }
        disabled={
          disabled ||
          exporting
        }
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#c9d9f3] hover:bg-[#f8f9ff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={14} />

        {exporting
          ? "Exporting..."
          : "Export as PDF"}
      </button>

      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
      >
        <Share2 size={14} />
        Share with Accountant
      </button>
    </div>
  );
}