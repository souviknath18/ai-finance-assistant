import {
  Plus,
  Target,
} from "lucide-react";

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
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Target
          size={15}
          className="text-emerald-700"
        />

        <h2 className="text-[15px] font-bold text-black">
          Financial Goals
        </h2>
      </div>

      <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="space-y-4">
          {goals.map((goal) => {
            const safeProgress = Math.min(
              Math.max(goal.progress, 0),
              100
            );

            return (
              <div
                key={goal.label}
                className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5"
              >
                <div className="mb-2.5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-black">
                      {goal.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#7c839b]">
                      Goal progress
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-bold text-emerald-700">
                    {safeProgress}%
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${goal.color}`}
                    style={{
                      width: `${safeProgress}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9d9f3] bg-[#fbfcff] text-[11px] font-bold text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700"
          >
            <Plus
              size={14}
              className="shrink-0"
            />

            Define New Financial Goal
          </button>
        </div>
      </div>
    </div>
  );
}