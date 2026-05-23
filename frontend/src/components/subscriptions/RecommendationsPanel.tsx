"use client";

import { useState } from "react";
import {
  DetectedSubscription,
  DuplicateSubscriptionGroup,
  UpcomingSubscriptionBill,
} from "@/types/subscription";
import RecommendationCard from "./RecommendationCard";
import UpcomingBillsCard from "./UpcomingBillsCard";
import ReviewSubscriptionModal from "./ReviewSubscriptionModal";
import ReviewServicesModal from "./ReviewServicesModal";

type RecommendationsPanelProps = {
  subscriptions: DetectedSubscription[];
  duplicates: DuplicateSubscriptionGroup[];
  upcomingBills: UpcomingSubscriptionBill[];
  onRefreshAction: () => void;
};

export default function RecommendationsPanel({
  subscriptions,
  duplicates,
  upcomingBills,
  onRefreshAction,
}: RecommendationsPanelProps) {
  const [selectedSubscription, setSelectedSubscription] =
    useState<DetectedSubscription | null>(null);

  const [selectedDuplicate, setSelectedDuplicate] =
    useState<DuplicateSubscriptionGroup | null>(null);

  const highest = [...subscriptions].sort(
    (a, b) => Number(b.average_amount) - Number(a.average_amount)
  )[0];

  const duplicate = duplicates[0];

  return (
    <>
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
            onClickAction={() => setSelectedSubscription(highest)}
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
            onClickAction={() => setSelectedDuplicate(duplicate)}
          />
        )}

        <UpcomingBillsCard upcomingBills={upcomingBills} />
      </aside>

      <ReviewSubscriptionModal
        open={Boolean(selectedSubscription)}
        subscription={selectedSubscription}
        onCloseAction={() => setSelectedSubscription(null)}
        onPreferenceUpdatedAction={onRefreshAction}
      />

      <ReviewServicesModal
        open={Boolean(selectedDuplicate)}
        duplicate={selectedDuplicate}
        subscriptions={subscriptions}
        onCloseAction={() => setSelectedDuplicate(null)}
      />
    </>
  );
}