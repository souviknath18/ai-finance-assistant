import { LucideIcon } from "lucide-react";

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
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Icon size={24} />
      </div>

      <h3 className="text-[13px] font-bold uppercase tracking-wide text-black">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-5 text-[#565e74]">
        {description}
      </p>
    </div>
  );
}