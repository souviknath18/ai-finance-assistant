import SubscriptionsHeader from "./SubscriptionsHeader";
import SummaryMetrics from "./SummaryMetrics";
import ActiveSubscriptions from "./ActiveSubscriptions";
import RecommendationsPanel from "./RecommendationsPanel";

export default function SubscriptionsPage() {
  return (
    <>
      <SubscriptionsHeader />
      <SummaryMetrics />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <ActiveSubscriptions />
        <RecommendationsPanel />
      </div>
    </>
  );
}