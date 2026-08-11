import {
  LucideIcon,
} from "lucide-react";

type TrustCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function TrustCard({
  icon: Icon,
  title,
  description,
}: TrustCardProps) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
        <Icon size={16} />
      </div>

      <h3 className="text-[11px] font-bold uppercase tracking-wide text-black">
        {title}
      </h3>

      <p className="mt-2 text-[11px] leading-5 text-[#565e74]">
        {description}
      </p>
    </div>
  );
}