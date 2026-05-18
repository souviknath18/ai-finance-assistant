import { Cloud, Music } from "lucide-react";

const upcomingBills = [
  {
    name: "Apple Music",
    amount: "$10.99",
    icon: Music,
  },
  {
    name: "iCloud+",
    amount: "$2.99",
    icon: Cloud,
  },
];

export default function UpcomingBillsCard() {
  return (
    <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xs font-bold uppercase tracking-wide text-[#7c839b]">
        Upcoming This Week
      </h3>

      <ul className="space-y-5">
        {upcomingBills.map((bill) => {
          const Icon = bill.icon;

          return (
            <li
              key={bill.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dce9ff]">
                  <Icon size={16} />
                </div>

                <span className="text-sm text-black">{bill.name}</span>
              </div>

              <span className="text-xs font-bold text-black">
                {bill.amount}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}