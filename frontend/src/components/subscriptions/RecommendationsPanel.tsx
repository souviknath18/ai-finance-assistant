import {
  DetectedSubscription,
  DuplicateSubscriptionGroup,
  UpcomingSubscriptionBill,
} from "@/types/subscription";
import RecommendationCard from "./RecommendationCard";
import UpcomingBillsCard from "./UpcomingBillsCard";

type RecommendationsPanelProps = {
  subscriptions: DetectedSubscription[];
  duplicates: DuplicateSubscriptionGroup[];
  upcomingBills: UpcomingSubscriptionBill[];
};

export default function RecommendationsPanel({
  subscriptions,
  duplicates,
  upcomingBills,
}: RecommendationsPanelProps) {
  const highest = [...subscriptions].sort(
    (a, b) => Number(b.average_amount) - Number(a.average_amount)
  )[0];

  const duplicate = duplicates[0];

  return (
    <aside className="space-y-6">
      <h2 className="text-2xl font-bold text-black">Smart Recommendations</h2>

      {highest && (
        <RecommendationCard
          type="info"
          label="Highest Subscription"
          title={highest.merchant}
          description={`This is your highest detected recurring payment at approximately ₹${Number(
            highest.average_amount
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}/month.`}
          buttonText="Review Subscription"
        />
      )}

      {duplicate && (
        <RecommendationCard
          type="warning"
          label="Possible Duplicate Services"
          title={duplicate.group}
          description={`You have ${duplicate.count} similar services: ${duplicate.services.join(
            ", "
          )}. Review them to avoid overlapping subscriptions.`}
          buttonText="Review Services"
        />
      )}

      <UpcomingBillsCard upcomingBills={upcomingBills} />
    </aside>
  );
}