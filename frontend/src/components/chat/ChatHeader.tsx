import { Search } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          AI Chat Assistant
        </h1>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          Ask Aura questions about spending, budgets, subscriptions, and
          savings.
        </p>
      </div>

      <div className="hidden items-center gap-2.5 rounded-full border border-[#c6c6cd] bg-white px-3.5 py-2 lg:flex">
        <Search size={16} className="text-[#565e74]" />

        <input
          className="w-48 border-none bg-transparent text-[13px] outline-none"
          placeholder="Search finances..."
        />
      </div>
    </div>
  );
}