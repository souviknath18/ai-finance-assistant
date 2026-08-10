import { suggestedQueries } from "./data";

type SuggestedQueriesProps = {
  onSelectAction: (
    query: string
  ) => void;
};

export default function SuggestedQueries({
  onSelectAction,
}: SuggestedQueriesProps) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-5">
      <div className="mb-3">
        <p className="text-[11px] font-bold text-black">
          Suggested questions
        </p>

        <p className="mt-1 text-[11px] text-[#7c839b]">
          Try asking Aura about your financial activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestedQueries.map((query) => {
          const Icon = query.icon;

          return (
            <button
              key={query.label}
              type="button"
              onClick={() =>
                onSelectAction(query.label)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
            >
              <Icon size={14} />

              {query.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}