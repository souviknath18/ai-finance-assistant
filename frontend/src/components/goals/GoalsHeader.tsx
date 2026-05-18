import { Plus } from "lucide-react";

export default function GoalsHeader() {
  return (
    <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Financial Goals
        </h1>

        <p className="mt-2 max-w-2xl text-base leading-7 text-[#565e74]">
          Visualizing your future. Tracking your progress through intelligent
          insights and automated growth strategies.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
        <Plus size={17} />
        Create New Goal
      </button>
    </section>
  );
}