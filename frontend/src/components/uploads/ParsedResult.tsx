import { Check } from "lucide-react";

type ParsedResultProps = {
  title: string;
  subtitle: string;
};

export default function ParsedResult({ title, subtitle }: ParsedResultProps) {
  return (
    <div className="rounded-2xl border border-transparent p-4 transition hover:border-[#c6c6cd] hover:bg-[#f8f9ff]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="max-w-[180px] truncate text-sm font-bold text-black">
            {title}
          </p>

          <p className="mt-1 text-sm text-[#565e74]">{subtitle}</p>
        </div>

        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check size={15} />
        </span>
      </div>
    </div>
  );
}