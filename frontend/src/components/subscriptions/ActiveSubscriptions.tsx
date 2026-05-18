import SubscriptionCard from "./SubscriptionCard";

const subscriptions = [
  {
    name: "Netflix",
    detail: "Standard Plan • Billing monthly",
    amount: "$15.49",
    next: "Next: Oct 12",
    tone: "red",
    primaryAction: "Optimize",
    secondaryAction: "Manage",
  },
  {
    name: "Spotify",
    detail: "Premium Family • Billing monthly",
    amount: "$16.99",
    next: "Next: Oct 05",
    tone: "green",
    primaryAction: "Cancel",
    secondaryAction: "Manage",
    danger: true,
  },
  {
    name: "AWS Cloud Services",
    detail: "Usage based • Variable billing",
    amount: "$84.22",
    next: "Est. $1,010/yr",
    tone: "blue",
    primaryAction: "Set Limit",
    secondaryAction: "Details",
  },
  {
    name: "Adobe Creative Cloud",
    detail: "All Apps Plan • Billing yearly",
    amount: "$54.99",
    next: "Next: Nov 20",
    tone: "red",
    primaryAction: "Optimize",
    secondaryAction: "Manage",
  },
];

export default function ActiveSubscriptions() {
  return (
    <section className="space-y-6 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Active Services</h2>

        <div className="flex rounded-xl bg-[#dce9ff] p-1">
          <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold shadow-sm">
            List
          </button>
          <button className="px-4 py-1.5 text-xs font-bold text-[#565e74]">
            Grid
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <SubscriptionCard key={subscription.name} {...subscription} />
        ))}
      </div>
    </section>
  );
}