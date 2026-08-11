import {
  Check,
  FileText,
} from "lucide-react";

type ParsedResultProps = {
  title: string;
  subtitle: string;
};

export default function ParsedResult({
  title,
  subtitle,
}: ParsedResultProps) {
  return (
    <div className="group rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 transition-[background-color,border-color] duration-200 hover:border-[#dce9ff] hover:bg-[#f8faff]">
      <div className="flex items-center gap-3">
        {/* File icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74]">
          <FileText size={15} />
        </div>

        {/* File info */}
        <div className="min-w-0 flex-1">
          <p
            title={title}
            className="truncate text-[11px] font-bold text-black"
          >
            {title}
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[#76777d]">
            {subtitle}
          </p>
        </div>

        {/* Success */}
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700"
          title="Successfully processed"
        >
          <Check
            size={13}
            strokeWidth={2.5}
          />
        </div>
      </div>
    </div>
  );
}