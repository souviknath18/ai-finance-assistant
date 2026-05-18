import { Brain, TrendingUp } from "lucide-react";

export default function AIPulseCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white p-8 shadow-sm">
      <Brain size={90} className="absolute right-4 top-4 text-emerald-100" />

      <h3 className="mb-3 text-2xl font-bold text-black">AI Pulse</h3>

      <p className="mb-6 text-sm leading-6 text-[#565e74]">
        Our AI engine identified 3 recurring subscriptions that increased in
        price this month.
      </p>

      <ul className="mb-8 space-y-3">
        <li className="flex items-center gap-2 text-sm font-bold">
          <TrendingUp size={17} className="text-emerald-700" />
          Netflix: +$2.00
        </li>

        <li className="flex items-center gap-2 text-sm font-bold">
          <TrendingUp size={17} className="text-emerald-700" />
          AWS Cloud: +$14.50
        </li>
      </ul>

      <button className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white transition hover:opacity-90">
        Review Suggestions
      </button>
    </div>
  );
}