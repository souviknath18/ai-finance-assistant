import { Check } from "lucide-react";

type ParsedResultProps = {
  title: string;
  subtitle: string;
};

export default function ParsedResult({ title, subtitle }: ParsedResultProps) {
  return (
    <div className="rounded-xl border border-transparent p-3.5 transition hover:border-[#c6c6cd] hover:bg-[#f8f9ff]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="max-w-[180px] truncate text-[13px] font-bold text-black">
            {title}
          </p>

          <p className="mt-1 text-[13px] text-[#565e74]">{subtitle}</p>
        </div>

        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check size={14} />
        </span>
      </div>
    </div>
  );
}