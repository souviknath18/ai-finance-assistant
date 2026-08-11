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
        className="border-y border-[#dce9ff] bg-[#f8faff] px-4 py-3"
      >
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                manual
                  ? "border-violet-100 bg-violet-50 text-violet-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}
            >
              {manual ? (
                <PenLine size={16} />
              ) : (
                <FileText size={16} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  title={uploadName}
                  className="max-w-[420px] truncate text-[12px] font-bold text-black"
                >
                  {uploadName}
                </p>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                    manual
                      ? "border-violet-200 bg-violet-50 text-violet-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {manual ? "Manual" : "Uploaded"}
                </span>
              </div>

              <p className="mt-0.5 text-[10px] leading-4 text-[#76777d]">
                {manual
                  ? "Transactions added manually"
                  : "Transactions extracted from this document"}
              </p>
            </div>
          </div>

          {/* COUNT */}
          <div className="shrink-0">
            <span className="inline-flex items-center rounded-full border border-[#dce9ff] bg-white px-2.5 py-1 text-[10px] font-bold text-[#565e74] shadow-sm">
              {visibleCount}{" "}
              {visibleCount === 1
                ? "transaction"
                : "transactions"}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}