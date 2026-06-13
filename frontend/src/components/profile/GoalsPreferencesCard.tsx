import { Plus } from "lucide-react";

const goals = [
  {
    label: "Early Retirement Fund",
    progress: 65,
    color: "bg-emerald-700",
  },
  {
    label: "Real Estate Portfolio",
    progress: 12,
    color: "bg-black",
  },
];

export default function GoalsPreferencesCard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-black">Financial Goals</h2>

      <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.label}>
              <div className="mb-2 flex justify-between gap-4 text-[13px] font-semibold">
                <span className="truncate text-black">{goal.label}</span>
                <span className="shrink-0 text-[#565e74]">
                  {goal.progress}% Achieved
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
                <div
                  className={`h-full rounded-full ${goal.color}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#c6c6cd] py-3 text-[13px] font-bold text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black">
            <Plus size={15} />
            Define New Financial Goal
          </button>
        </div>
      </div>
    </div>
  );
}