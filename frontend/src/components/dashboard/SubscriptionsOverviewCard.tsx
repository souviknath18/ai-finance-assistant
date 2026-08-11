import {
  CalendarDays,
  Repeat2,
} from "lucide-react";

type SubscriptionsOverviewCardProps = {
  subscriptions: {
    id: number;
    name: string;
    price: string;
    nextBilling: string;
  }[];
  monthlyTotal: string;
};

export default function SubscriptionsOverviewCard({
  subscriptions,
  monthlyTotal,
}: SubscriptionsOverviewCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Repeat2 size={17} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                Subscriptions
              </h3>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                Recurring payments detected from your transactions.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            {monthlyTotal}/mo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e6edf9] bg-white text-[#7c839b]">
              <Repeat2 size={17} />
            </div>

            <p className="mt-3 text-[13px] font-bold text-black">
              No subscriptions found
            </p>

            <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-[#565e74]">
              Aura will automatically detect recurring payments from your
              uploaded financial activity.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {subscriptions.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-100 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
              >
                {/* Left */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-[11px] font-bold text-white">
                    {item.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p
                      title={item.name}
                      className="truncate text-[12px] font-bold text-black"
                    >
                      {item.name}
                    </p>

                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-[#7c839b]">
                      <CalendarDays
                        size={11}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        Next: {item.nextBilling}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="shrink-0 text-right">
                  <p className="text-[12px] font-bold text-black">
                    {item.price}
                  </p>

                  <button
                    type="button"
                    className="mt-1.5 rounded-lg border border-[#e6edf9] bg-white px-2 py-1 text-[9px] font-bold text-[#565e74] transition-[background-color,border-color,color] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}