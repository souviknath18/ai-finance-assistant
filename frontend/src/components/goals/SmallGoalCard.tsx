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
    <div className="flex flex-col rounded-3xl border border-[#c6c6cd] bg-white p-6 shadow-sm md:col-span-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="rounded-xl bg-[#e5eeff] p-3 text-black">
          {icon}
        </div>

        <MoreVertical size={20} className="text-[#76777d]" />
      </div>

      <h3 className="text-2xl font-bold text-black">{title}</h3>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-bold text-black">{current}</span>
        <span className="text-sm text-[#565e74]">/ {target}</span>
      </div>

      <div className="mt-6 h-2 w-full rounded-full bg-[#e5eeff]">
        <div
          className="h-full rounded-full bg-indigo-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {note}
      </p>
    </div>
  );
}