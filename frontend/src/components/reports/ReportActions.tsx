import { Download, Share2 } from "lucide-react";

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
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={onExportPDFAction}
        disabled={disabled || exporting}
        className="flex items-center gap-2 rounded-xl border border-[#76777d] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={15} />
        {exporting ? "Exporting..." : "Export as PDF"}
      </button>

      <button className="flex items-center gap-2 rounded-xl border border-[#76777d] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#e5eeff]">
        <Share2 size={15} />
        Share with Accountant
      </button>
    </div>
  );
}