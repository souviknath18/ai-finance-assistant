import { GitMerge } from "lucide-react";

export default function MergeWorkflowCard() {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-black p-8 text-white md:flex-row">
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
          <GitMerge size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">Merge Workflow</h2>

          <p className="mt-2 text-sm leading-6 text-[#bec6e0]">
            Select two categories from the list above to consolidate their
            history and future rules into one.
          </p>
        </div>
      </div>

      <button className="whitespace-nowrap rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:opacity-90">
        Start Merge Process
      </button>
    </div>
  );
}