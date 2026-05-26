import { Cloud } from "lucide-react";
import { UpcomingSubscriptionBill } from "@/types/subscription";

type UpcomingBillsCardProps = {
  upcomingBills: UpcomingSubscriptionBill[];
};

export default function UpcomingBillsCard({
  upcomingBills,
}: UpcomingBillsCardProps) {
  return (
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        Upcoming This Week
      </h3>

      {upcomingBills.length === 0 ? (
        <p className="text-[13px] text-[#565e74]">
          No upcoming subscription renewals detected this week.
        </p>
      ) : (
        <ul className="space-y-4">
          {upcomingBills.map((bill) => (
            <li
              key={bill.merchant}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#dce9ff]">
                  <Cloud size={14} />
                </div>

                <div>
                  <span className="block text-[13px] text-black">
                    {bill.merchant}
                  </span>

                  <span className="text-[11px] text-[#7c839b]">
                    Due in {bill.days_remaining} day
                    {bill.days_remaining !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-black">
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