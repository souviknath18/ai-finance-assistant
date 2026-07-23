import { FileText, PenLine } from "lucide-react";

type UploadGroupRowProps = {
  uploadName: string;
  visibleCount: number;
  manual?: boolean;
};

export default function UploadGroupRow({
  uploadName,
  visibleCount,
  manual = false,
}: UploadGroupRowProps) {
  return (
    <tr>
      <td
        colSpan={7}
        className="border-y border-emerald-100 bg-emerald-50/70 px-4 py-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
              {manual ? (
                <PenLine size={17} />
              ) : (
                <FileText size={17} />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-black">
                {uploadName}
              </p>

              <p className="mt-0.5 text-[11px] text-[#565e74]">
                {manual
                  ? "Transactions added manually"
                  : "Transactions extracted from this document"}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            {visibleCount} shown
          </span>
        </div>
      </td>
    </tr>
  );
}