import { Download, Share2 } from "lucide-react";

export default function ReportActions() {
  return (
    <div className="mt-8 flex justify-end gap-4">
      <button className="flex items-center gap-2 rounded-xl border border-[#76777d] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#e5eeff]">
        <Download size={17} />
        Export as PDF
      </button>

      <button className="flex items-center gap-2 rounded-xl border border-[#76777d] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#e5eeff]">
        <Share2 size={17} />
        Share with Accountant
      </button>
    </div>
  );
}