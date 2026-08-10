import { CalendarClock } from "lucide-react";

import IconCircle from "./IconCircle";

import { UpcomingSubscriptionBill } from "@/types/subscription";

type UpcomingBillsCardProps = {
  upcomingBills: UpcomingSubscriptionBill[];
};

export default function UpcomingBillsCard({
  upcomingBills,
}: UpcomingBillsCardProps) {
  const upcomingItems = upcomingBills.slice(0, 4);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)]">
      {/* Header */}
      <div className="mb-5 flex items-start gap-3">
        <IconCircle
          tone="green"
          size="md"
        >
          <CalendarClock size={17} />
        </IconCircle>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Upcoming Bills
          </p>

          <p className="mt-1 text-[13px] font-semibold text-black">
            Recurring payments coming up
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {upcomingItems.length === 0 ? (
          <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-5 text-center">
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e6edf9] bg-white text-[#7c839b]">
                <CalendarClock size={16} />
              </div>

              <p className="mt-3 text-[13px] font-bold text-black">
                No upcoming bills
              </p>

              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#565e74]">
                No upcoming subscription renewals have been detected yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingItems.map(
              (item, index) => (
                <UpcomingBillRow
                  key={`${item.merchant}-${item.next_date}-${index}`}
                  item={item}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {upcomingItems.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 border-t border-[#edf2fb] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] leading-5 text-[#8a92a5]">
            Based on detected recurring payment patterns.
          </p>

          <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-[#fbfcff] px-4 text-[10px] font-bold text-[#565e74]">
            {upcomingBills.length} upcoming
          </span>
        </div>
      )}
    </div>
  );
}

function UpcomingBillRow({
  item,
}: {
  item: UpcomingSubscriptionBill;
}) {
  const daysRemaining =
    item.days_remaining;

  const urgencyStyles =
    daysRemaining <= 3
      ? {
          badge:
            "border-red-100 bg-red-50 text-red-600",
          dot: "bg-red-500",
        }
      : daysRemaining <= 7
      ? {
          badge:
            "border-amber-100 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
        }
      : {
          badge:
            "border-emerald-100 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
        };

  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-black">
            {item.merchant}
          </p>

          <p className="mt-1 text-[10px] text-[#8a92a5]">
            {formatBillingDate(
              item.next_date
            )}
          </p>
        </div>

        {/* Right */}
        <div className="shrink-0 text-right">
          <p className="text-[13px] font-bold text-black">
            ₹
            {Number(
              item.amount
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <span
            className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${urgencyStyles.badge}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${urgencyStyles.dot}`}
            />

            {getDueLabel(
              daysRemaining
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function getDueLabel(
  daysRemaining: number
) {
  if (daysRemaining < 0) {
    return "Overdue";
  }

  if (daysRemaining === 0) {
    return "Due today";
  }

  if (daysRemaining === 1) {
    return "Due tomorrow";
  }

  return `${daysRemaining} days`;
}

function formatBillingDate(
  value: string
) {
  if (!value) {
    return "Billing date unavailable";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}