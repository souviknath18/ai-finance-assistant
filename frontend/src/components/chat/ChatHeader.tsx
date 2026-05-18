import { Search } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">
          AI Chat Assistant
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Ask Aura questions about spending, budgets, subscriptions, and
          savings.
        </p>
      </div>

      <div className="hidden items-center gap-3 rounded-full border border-[#c6c6cd] bg-white px-4 py-2 lg:flex">
        <Search size={18} className="text-[#565e74]" />

        <input
          className="w-52 border-none bg-transparent text-sm outline-none"
          placeholder="Search finances..."
        />
      </div>
    </div>
  );
}