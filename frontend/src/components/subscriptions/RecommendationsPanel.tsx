"use client";

import { useState } from "react";
import {
  Sparkles,
  WandSparkles,
} from "lucide-react";

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
  const [
    selectedSubscription,
    setSelectedSubscription,
  ] =
    useState<DetectedSubscription | null>(
      null
    );

  const [
    selectedDuplicate,
    setSelectedDuplicate,
  ] =
    useState<DuplicateSubscriptionGroup | null>(
      null
    );

  const highest = [...subscriptions].sort(
    (a, b) =>
      Number(b.average_amount) -
      Number(a.average_amount)
  )[0];

  const duplicate = duplicates[0];

  const recommendationCount =
    (highest ? 1 : 0) +
    (duplicate ? 1 : 0) +
    (upcomingBills.length > 0 ? 1 : 0);

  return (
    <>
      <aside className="lg:col-span-1">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <WandSparkles size={17} />
            </div>

            <div className="min-w-0">
              <h2 className="text-[16px] font-bold tracking-tight text-black">
                Smart Recommendations
              </h2>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                Aura highlights opportunities across your recurring spend.
              </p>
            </div>
          </div>

          {recommendationCount > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              {recommendationCount}
            </span>
          )}
        </div>

        {/* Recommendation Cards */}
        <div className="space-y-3">
          {highest && (
            <RecommendationCard
              type="info"
              label="Highest Subscription"
              title={highest.merchant}
              description={`This is your highest detected recurring payment at approximately ₹${Number(
                highest.average_amount
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}/month.`}
              buttonText="Review Subscription"
              onClickAction={() =>
                setSelectedSubscription(
                  highest
                )
              }
            />
          )}

          {duplicate && (
            <RecommendationCard
              type="warning"
              label="Possible Duplicate Services"
              title={duplicate.group}
              description={`You have ${
                duplicate.count
              } similar services: ${duplicate.services.join(
                ", "
              )}. Review them to avoid overlapping subscriptions.`}
              buttonText="Review Services"
              onClickAction={() =>
                setSelectedDuplicate(
                  duplicate
                )
              }
            />
          )}

          <UpcomingBillsCard
            upcomingBills={
              upcomingBills
            }
          />

          {!highest &&
            !duplicate &&
            upcomingBills.length ===
              0 && (
              <div className="rounded-3xl border border-dashed border-[#dbe5f5] bg-white p-6 text-center shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <Sparkles
                    size={16}
                  />
                </div>

                <h3 className="mt-3 text-[13px] font-bold text-black">
                  Everything looks good
                </h3>

                <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
                  Aura has no urgent
                  subscription
                  recommendations right
                  now.
                </p>
              </div>
            )}
        </div>
      </aside>

      <ReviewSubscriptionModal
        open={Boolean(
          selectedSubscription
        )}
        subscription={
          selectedSubscription
        }
        onCloseAction={() =>
          setSelectedSubscription(
            null
          )
        }
        onPreferenceUpdatedAction={
          onRefreshAction
        }
      />

      <ReviewServicesModal
        open={Boolean(
          selectedDuplicate
        )}
        duplicate={
          selectedDuplicate
        }
        subscriptions={
          subscriptions
        }
        onCloseAction={() =>
          setSelectedDuplicate(null)
        }
      />
    </>
  );
}