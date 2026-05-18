import RecommendationCard from "./RecommendationCard";
import UpcomingBillsCard from "./UpcomingBillsCard";

export default function RecommendationsPanel() {
  return (
    <aside className="space-y-6">
      <h2 className="text-2xl font-bold text-black">Smart Recommendations</h2>

      <RecommendationCard
        type="warning"
        label="Unused Service"
        title="Hulu Plus"
        description="No activity detected for 64 days. Cancel now to save $14.99/mo."
        buttonText="Cancel Subscription"
      />

      <RecommendationCard
        type="info"
        label="Price Update"
        title="YouTube Premium"
        description="Monthly cost will increase by $2.00 starting next billing cycle."
        buttonText="Acknowledge"
      />

      <UpcomingBillsCard />
    </aside>
  );
}