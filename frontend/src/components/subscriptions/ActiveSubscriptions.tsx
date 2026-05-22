import { DetectedSubscription } from "@/types/subscription";
import SubscriptionCard from "./SubscriptionCard";

type ActiveSubscriptionsProps = {
  subscriptions: DetectedSubscription[];
  loading: boolean;
};

export default function ActiveSubscriptions({
  subscriptions,
  loading,
}: ActiveSubscriptionsProps) {
  if (loading) {
    return (
      <section className="space-y-6 lg:col-span-2">
        <h2 className="text-2xl font-bold text-black">Active Services</h2>
        <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 text-sm font-semibold text-[#565e74]">
          Detecting subscriptions...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Active Services</h2>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 text-sm font-semibold text-[#565e74]">
          No recurring subscriptions detected yet.
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.merchant}
              name={subscription.merchant}
              detail={`${subscription.transactions_count} recurring payments • ${subscription.category}`}
              amount={`₹${Number(subscription.average_amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}`}
              next={`Last: ${subscription.last_payment_date}`}
              tone="blue"
              primaryAction="Details"
              secondaryAction="Manage"
            />
          ))}
        </div>
      )}
    </section>
  );
}