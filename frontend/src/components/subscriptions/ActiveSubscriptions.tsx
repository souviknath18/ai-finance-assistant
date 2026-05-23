"use client";

import { useEffect, useState } from "react";
import { DetectedSubscription } from "@/types/subscription";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionDetailsModal from "./SubscriptionDetailsModal";
import ManageSubscriptionModal from "./ManageSubscriptionModal";

type ActiveSubscriptionsProps = {
  subscriptions: DetectedSubscription[];
  loading: boolean;
  onRefreshAction: () => void;
  emptyMessage?: string;
};

export default function ActiveSubscriptions({
  subscriptions,
  loading,
  onRefreshAction,
  emptyMessage = "No recurring subscriptions detected yet.",
}: ActiveSubscriptionsProps) {
  const [detailsSubscription, setDetailsSubscription] =
    useState<DetectedSubscription | null>(null);

  const [manageSubscription, setManageSubscription] =
    useState<DetectedSubscription | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const totalPages = Math.ceil(subscriptions.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const visibleSubscriptions = subscriptions.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [subscriptions.length]);

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
    <>
      <section className="space-y-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Active Services</h2>
        </div>

        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 text-sm font-semibold text-[#565e74]">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleSubscriptions.map((subscription) => {
              const amount = `₹${Number(
                subscription.average_amount
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}`;

              const next = subscription.next_billing_date
                ? `Next: ${new Date(
                    subscription.next_billing_date
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}`
                : subscription.last_payment_date
                ? `Last: ${new Date(
                    subscription.last_payment_date
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}`
                : "Billing date unavailable";

              const detail = `${subscription.transactions_count} recurring payment${
                subscription.transactions_count !== 1 ? "s" : ""
              } • ${subscription.category || "Uncategorized"}`;

              return (
                <SubscriptionCard
                  key={subscription.subscription_id}
                  name={subscription.merchant}
                  detail={detail}
                  amount={amount}
                  next={next}
                  tone={
                    subscription.preference_status === "cancel_candidate"
                      ? "red"
                      : subscription.preference_status === "confirmed"
                      ? "green"
                      : "blue"
                  }
                  primaryAction="Details"
                  secondaryAction="Manage"
                  danger={
                    subscription.preference_status === "cancel_candidate"
                  }
                  onPrimaryAction={() => setDetailsSubscription(subscription)}
                  onSecondaryAction={() => setManageSubscription(subscription)}
                />
              );
            })}

            {subscriptions.length > PAGE_SIZE && (
              <div className="flex flex-col gap-3 rounded-3xl border border-[#dce9ff] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#565e74]">
                  Showing {startIndex + 1}–
                  {Math.min(endIndex, subscriptions.length)} of{" "}
                  {subscriptions.length}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-xl border border-[#c6c6cd] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <SubscriptionDetailsModal
        open={Boolean(detailsSubscription)}
        subscription={detailsSubscription}
        onCloseAction={() => setDetailsSubscription(null)}
      />

      <ManageSubscriptionModal
        open={Boolean(manageSubscription)}
        subscription={manageSubscription}
        onCloseAction={() => setManageSubscription(null)}
        onUpdatedAction={onRefreshAction}
      />
    </>
  );
}