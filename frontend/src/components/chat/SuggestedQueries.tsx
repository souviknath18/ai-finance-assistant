import { suggestedQueries } from "./data";

type SuggestedQueriesProps = {
  onSelectAction: (query: string) => void;
};

export default function SuggestedQueries({
  onSelectAction,
}: SuggestedQueriesProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {suggestedQueries.map((query) => {
        const Icon = query.icon;

        return (
          <button
            key={query.label}
            onClick={() => onSelectAction(query.label)}
            className="flex items-center gap-2 rounded-full border border-[#c6c6cd] bg-white px-4 py-2.5 text-[13px] text-black transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon size={15} />
            {query.label}
          </button>
        );
      })}
    </div>
  );
}