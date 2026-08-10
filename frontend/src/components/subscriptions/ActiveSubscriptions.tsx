"use client";

import {
  useEffect,
  useState,
} from "react";

import { Layers3 } from "lucide-react";

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
  const [
    detailsSubscription,
    setDetailsSubscription,
  ] =
    useState<DetectedSubscription | null>(
      null
    );

  const [
    manageSubscription,
    setManageSubscription,
  ] =
    useState<DetectedSubscription | null>(
      null
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const PAGE_SIZE = 6;

  const totalPages = Math.ceil(
    subscriptions.length / PAGE_SIZE
  );

  const startIndex =
    (currentPage - 1) * PAGE_SIZE;

  const endIndex =
    startIndex + PAGE_SIZE;

  const visibleSubscriptions =
    subscriptions.slice(
      startIndex,
      endIndex
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [subscriptions.length]);

  if (loading) {
    return (
      <section className="lg:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Layers3 size={17} />
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black">
              Active Services
            </h2>

            <p className="mt-0.5 text-[12px] text-[#565e74]">
              Detecting subscriptions...
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-[#f3f6fc]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="lg:col-span-2">
        {/* Section header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Layers3 size={17} />
            </div>

            <div>
              <h2 className="text-[16px] font-bold tracking-tight text-black">
                Active Services
              </h2>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                Review detected recurring payments and manage how Aura tracks them.
              </p>
            </div>
          </div>

          {subscriptions.length > 0 && (
            <span className="inline-flex w-fit rounded-full border border-[#e6edf9] bg-[#fbfcff] px-3 py-1 text-[10px] font-bold text-[#565e74]">
              {subscriptions.length}{" "}
              {subscriptions.length === 1
                ? "service"
                : "services"}
            </span>
          )}
        </div>

        {/* Empty */}
        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#dbe5f5] bg-white p-8 text-center shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e6edf9] bg-[#fbfcff] text-[#7c839b]">
              <Layers3 size={18} />
            </div>

            <h3 className="mt-4 text-[14px] font-bold text-black">
              No subscriptions found
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-[#565e74]">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleSubscriptions.map(
              (subscription) => {
                const amount = `₹${Number(
                  subscription.average_amount
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`;

                const next =
                  subscription.next_billing_date
                    ? `Next: ${new Date(
                        subscription.next_billing_date
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}`
                    : subscription.last_payment_date
                    ? `Last: ${new Date(
                        subscription.last_payment_date
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}`
                    : "Billing date unavailable";

                const detail = `${
                  subscription.transactions_count
                } recurring payment${
                  subscription.transactions_count !==
                  1
                    ? "s"
                    : ""
                } • ${
                  subscription.category ||
                  "Uncategorized"
                }`;

                return (
                  <SubscriptionCard
                    key={
                      subscription.subscription_id
                    }
                    name={
                      subscription.merchant
                    }
                    detail={detail}
                    amount={amount}
                    next={next}
                    tone={
                      subscription.preference_status ===
                      "cancel_candidate"
                        ? "red"
                        : subscription.preference_status ===
                          "confirmed"
                        ? "green"
                        : "blue"
                    }
                    primaryAction="Details"
                    secondaryAction="Manage"
                    danger={
                      subscription.preference_status ===
                      "cancel_candidate"
                    }
                    onPrimaryAction={() =>
                      setDetailsSubscription(
                        subscription
                      )
                    }
                    onSecondaryAction={() =>
                      setManageSubscription(
                        subscription
                      )
                    }
                  />
                );
              }
            )}

            {/* Pagination */}
            {subscriptions.length >
              PAGE_SIZE && (
              <div className="flex flex-col gap-3 rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] font-medium text-[#565e74]">
                  Showing{" "}
                  <span className="font-bold text-black">
                    {startIndex + 1}–
                    {Math.min(
                      endIndex,
                      subscriptions.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-black">
                    {
                      subscriptions.length
                    }
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev - 1
                      )
                    }
                    className="h-9 rounded-xl border border-[#e6edf9] bg-white px-3.5 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev + 1
                      )
                    }
                    className="h-9 rounded-xl bg-black px-3.5 text-[11px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_4px_12px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
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
        open={Boolean(
          detailsSubscription
        )}
        subscription={
          detailsSubscription
        }
        onCloseAction={() =>
          setDetailsSubscription(null)
        }
      />

      <ManageSubscriptionModal
        open={Boolean(
          manageSubscription
        )}
        subscription={
          manageSubscription
        }
        onCloseAction={() =>
          setManageSubscription(null)
        }
        onUpdatedAction={
          onRefreshAction
        }
      />
    </>
  );
}