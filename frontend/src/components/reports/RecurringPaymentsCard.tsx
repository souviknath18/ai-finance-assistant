import {
  CalendarClock,
  Repeat2,
} from "lucide-react";

type RecurringPayment = {
  merchant: string;
  average_amount: string;
  next_billing_date?: string;
  billing_cycle?: string;
};

type RecurringPaymentsCardProps = {
  payments: RecurringPayment[];
  count: number;
};

export default function RecurringPaymentsCard({
  payments,
  count,
}: RecurringPaymentsCardProps) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:col-span-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Repeat2 size={17} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Recurring Spend
            </p>

            <h2 className="mt-1 text-[16px] font-bold text-black">
              Recurring Payments
            </h2>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-[#e6edf9] bg-[#fbfcff] px-3 py-1 text-[9px] font-bold text-[#565e74]">
          {count} active
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-5 text-center">
          <p className="text-[12px] text-[#565e74]">
            No recurring payments detected yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {payments.map(
            (payment) => (
              <div
                key={
                  payment.merchant
                }
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74]">
                    <CalendarClock
                      size={15}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-black">
                      {
                        payment.merchant
                      }
                    </p>

                    <p className="mt-1 text-[10px] text-[#7c839b]">
                      {formatCycle(
                        payment.billing_cycle
                      )}
                      {" • "}
                      {payment.next_billing_date
                        ? `Renews ${formatDate(
                            payment.next_billing_date
                          )}`
                        : "Renewal date unknown"}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-[12px] font-bold text-black">
                  ₹
                  {Number(
                    payment.average_amount
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function formatCycle(
  value?: string
) {
  if (!value) {
    return "Monthly";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function formatDate(
  value: string
) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  );
}