import BillingHeader from "./BillingHeader";
import CurrentPlanCard from "./CurrentPlanCard";
import AIInsightCard from "./AIInsightCard";
import PaymentMethodCard from "./PaymentMethodCard";
import InvoiceHistoryCard from "./InvoiceHistoryCard";

export default function BillingPage() {
  return (
    <>
      <BillingHeader />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <CurrentPlanCard />
          <InvoiceHistoryCard />
        </div>

        <div className="space-y-4 lg:col-span-4">
          <AIInsightCard />
          <PaymentMethodCard />
        </div>
      </div>
    </>
  );
}