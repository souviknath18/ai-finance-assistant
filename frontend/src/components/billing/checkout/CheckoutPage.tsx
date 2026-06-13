import CheckoutHeader from "./CheckoutHeader";
import OrderSummaryCard from "./OrderSummaryCard";
import PricingSummaryCard from "./PricingSummaryCard";
import PaymentForm from "./PaymentForm";
import SecurityBadges from "./SecurityBadges";

export default function CheckoutPage() {
  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <CheckoutHeader />
          <OrderSummaryCard />
          <PricingSummaryCard />
          <SecurityBadges />
        </div>

        <div className="lg:col-span-7">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
}