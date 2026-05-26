import { MoreVertical } from "lucide-react";

type SmallGoalCardProps = {
  icon: React.ReactNode;
  title: string;
  current: string;
  target: string;
  progress: number;
  note: string;
};

export default function SmallGoalCard({
  icon,
  title,
  current,
  target,
  progress,
  note,
}: SmallGoalCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-sm md:col-span-4">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-xl bg-[#e5eeff] p-2.5 text-black">
          {icon}
        </div>

        <MoreVertical size={18} className="text-[#76777d]" />
      </div>

      <h3 className="text-lg font-bold text-black">{title}</h3>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-base font-bold text-black">{current}</span>
        <span className="text-[13px] text-[#565e74]">/ {target}</span>
      </div>

      <div className="mt-5 h-1.5 w-full rounded-full bg-[#e5eeff]">
        <div
          className="h-full rounded-full bg-indigo-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {note}
      </p>
    </div>
  );
}