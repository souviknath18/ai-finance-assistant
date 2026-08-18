import {
  Clock3,
  IndianRupee,
  Landmark,
  Link2,
} from "lucide-react";

import {
  AccountSummary,
} from "@/types/account";

type AccountsSummaryProps = {
  summary: AccountSummary;
};

function formatCurrency(
  amount: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

function formatSyncTime(
  value: string | null
) {
  if (!value) {
    return "Not synced yet";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not synced yet";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

export default function AccountsSummary({
  summary,
}: AccountsSummaryProps) {
  const items = [
    {
      label: "Total Balance",
      value: formatCurrency(
        summary.total_balance
      ),
      description:
        "Across connected accounts",
      icon: IndianRupee,
    },
    {
      label: "Accounts",
      value: String(
        summary.total_accounts
      ),
      description:
        "Financial accounts added",
      icon: Landmark,
    },
    {
      label: "Active Connections",
      value: String(
        summary.connected_accounts
      ),
      description:
        "Currently connected",
      icon: Link2,
    },
    {
      label: "Last Sync",
      value: formatSyncTime(
        summary.last_synced_at
      ),
      description:
        "Latest transaction refresh",
      icon: Clock3,
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(
        (item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#e6edf9] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a93a6]">
                    {item.label}
                  </p>

                  <p className="mt-2 truncate text-[19px] font-bold tracking-tight text-[#0b1c30]">
                    {item.value}
                  </p>

                  <p className="mt-1 text-[11px] text-[#7c839b]">
                    {
                      item.description
                    }
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-[#f8faff] text-[#4f5b70]">
                  <Icon size={15} />
                </div>
              </div>
            </div>
          );
        }
      )}
    </section>
  );
}