import { CalendarDays, Repeat2 } from "lucide-react";

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
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Header */}

      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Repeat2 size={20} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                Subscriptions
              </h3>

              <p className="text-[12px] text-[#565e74]">
                Recurring payments detected
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-700">
            {monthlyTotal}/mo
          </span>
        </div>
      </div>

      {/* List */}

      <div className="space-y-2 p-4 sm:p-5">
        {subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed rounded-2xl border border-dashed border-[#dbe5f5] bg-[#f8f9ff] p-6 text-center p-5 text-center">
            <p className="mb-1 text-[13px] font-bold text-black">
              No subscriptions found
            </p>

            <p className="mt-1 text-[12px] text-[#565e74]">
              Aura will automatically detect recurring payments from your
              uploaded statements.
            </p>
          </div>
        ) : (
          subscriptions.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-transparent p-2.5 transition hover:border-emerald-100 hover:bg-emerald-50/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                {/* Logo */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                  <span className="text-[12px] font-bold">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-black">
                    {item.name}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#565e74]">
                    <CalendarDays
                      size={12}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      Next: {item.nextBilling}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right */}

              <div className="shrink-0 text-right">
                <p className="mb-1 text-[13px] font-bold text-black">
                  {item.price}
                </p>

                <button className="rounded-lg border border-[#e6edf9] px-2 py-1 text-[11px] font-bold text-[#4b5563] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:opacity-0 sm:group-hover:opacity-100">
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}