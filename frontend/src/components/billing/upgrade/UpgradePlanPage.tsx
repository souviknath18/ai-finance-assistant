"use client";

import { useState } from "react";
import UpgradeHeader from "./UpgradeHeader";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";
import FAQSection from "./FAQSection";
import TrustSection from "./TrustSection";
import { upgradePlans } from "./upgradePlans";

export default function UpgradePlanPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="pb-12">
      <UpgradeHeader />

      <BillingToggle
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
      />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {upgradePlans.map((plan) => (
          <PlanCard
            key={plan.title}
            plan={plan}
            billingCycle={billingCycle}
          />
        ))}
      </section>

      <FAQSection />

      <TrustSection />
    </div>
  );
}