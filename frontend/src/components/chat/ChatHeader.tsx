export default function ChatHeader() {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {/* 
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          Aura Intelligence
        </span>
        */}

        <h1 className="text-xl font-bold tracking-tight text-black">
          Aura Chat
        </h1>

        <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
          Ask Aura questions about your spending, budgets,
          subscriptions, savings, and transaction history.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

        <span className="text-[10px] font-bold text-emerald-700">
          Aura Online
        </span>
      </div>
    </section>
  );
}