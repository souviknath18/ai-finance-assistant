import { suggestedQueries } from "./data";

export default function SuggestedQueries() {
  return (
    <div className="flex flex-wrap gap-3">
      {suggestedQueries.map((query) => {
        const Icon = query.icon;

        return (
          <button
            key={query.label}
            className="flex items-center gap-2 rounded-full border border-[#c6c6cd] bg-white px-5 py-3 text-sm text-black transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Icon size={17} />
            {query.label}
          </button>
        );
      })}
    </div>
  );
}