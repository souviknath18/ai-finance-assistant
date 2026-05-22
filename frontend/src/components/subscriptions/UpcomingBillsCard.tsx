import { Cloud } from "lucide-react";
import { UpcomingSubscriptionBill } from "@/types/subscription";

type UpcomingBillsCardProps = {
  upcomingBills: UpcomingSubscriptionBill[];
};

export default function UpcomingBillsCard({
  upcomingBills,
}: UpcomingBillsCardProps) {
  return (
    <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xs font-bold uppercase tracking-wide text-[#7c839b]">
        Upcoming This Week
      </h3>

      {upcomingBills.length === 0 ? (
        <p className="text-sm text-[#565e74]">
          No upcoming subscription renewals detected this week.
        </p>
      ) : (
        <ul className="space-y-5">
          {upcomingBills.map((bill) => (
            <li
              key={bill.merchant}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dce9ff]">
                  <Cloud size={16} />
                </div>

                <div>
                  <span className="block text-sm text-black">
                    {bill.merchant}
                  </span>

                  <span className="text-xs text-[#7c839b]">
                    Due in {bill.days_remaining} day
                    {bill.days_remaining !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-black">
                ₹{Number(bill.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}