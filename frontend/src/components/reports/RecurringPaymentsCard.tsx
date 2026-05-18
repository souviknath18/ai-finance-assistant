import { Cloud, Dumbbell, Film } from "lucide-react";

const payments = [
  {
    name: "AWS Cloud Services",
    detail: "Monthly • Renewing Jan 12",
    amount: "$124.50",
    icon: Cloud,
  },
  {
    name: "Equinox Global",
    detail: "Monthly • Renewing Jan 1",
    amount: "$210.00",
    icon: Dumbbell,
  },
  {
    name: "Max Premium",
    detail: "Annual • Renewing Dec 28",
    amount: "$19.99",
    icon: Film,
  },
];

export default function RecurringPaymentsCard() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl md:col-span-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          Recurring Payments
        </h2>

        <span className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
          12 active subs
        </span>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => {
          const Icon = payment.icon;

          return (
            <div
              key={payment.name}
              className="flex items-center justify-between gap-4 rounded-2xl bg-[#eff4ff] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c6c6cd] bg-white">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-black">
                    {payment.name}
                  </p>
                  <p className="text-sm text-[#565e74]">{payment.detail}</p>
                </div>
              </div>

              <span className="text-sm font-bold text-black">
                {payment.amount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}