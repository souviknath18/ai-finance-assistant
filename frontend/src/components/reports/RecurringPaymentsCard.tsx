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
    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl md:col-span-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          Recurring Payments
        </h2>

        <span className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
          {count} active subs
        </span>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-sm font-semibold text-[#565e74]">
            No recurring payments detected yet.
          </p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.merchant}
              className="flex items-center justify-between gap-4 rounded-2xl bg-[#eff4ff] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c6c6cd] bg-white">
                  <Cloud size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-black">
                    {payment.merchant}
                  </p>
                  <p className="text-sm text-[#565e74]">
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

              <span className="text-sm font-bold text-black">
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