import { Cloud } from "lucide-react";

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
    <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl md:col-span-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">
          Recurring Payments
        </h2>

        <span className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
          {count} active subs
        </span>
      </div>

      <div className="space-y-3">
        {payments.length === 0 ? (
          <p className="text-[13px] font-semibold text-[#565e74]">
            No recurring payments detected yet.
          </p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.merchant}
              className="flex items-center justify-between gap-4 rounded-2xl bg-[#eff4ff] p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c6c6cd] bg-white">
                  <Cloud size={16} />
                </div>

                <div>
                  <p className="text-[13px] font-bold text-black">
                    {payment.merchant}
                  </p>

                  <p className="text-[13px] text-[#565e74]">
                    {payment.billing_cycle || "Monthly"} •{" "}
                    {payment.next_billing_date
                      ? `Renewing ${new Date(
                          payment.next_billing_date
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}`
                      : "Renewal date unknown"}
                  </p>
                </div>
              </div>

              <span className="text-[13px] font-bold text-black">
                ₹
                {Number(payment.average_amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}