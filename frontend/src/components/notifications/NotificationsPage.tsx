"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import NotificationsHeader from "./NotificationsHeader";
import NotificationFilters from "./NotificationFilters";
import AuraAIAlertCard from "./AuraAIAlertCard";
import NotificationTimeline from "./NotificationTimeline";

import PageLoader from "@/components/ui/PageLoader";

import {
  AppNotification,
  NotificationResponse,
} from "@/types/notification";

import {
  getNotifications,
} from "@/lib/api/notificationsApi";

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<AppNotification[]>([]);

  const [
    counts,
    setCounts,
  ] = useState<
    NotificationResponse["counts"]
  >({
    all: 0,
    budget: 0,
    goal: 0,
    report: 0,
    subscription: 0,
    ai_alert: 0,
    transaction: 0,
  });

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadNotifications =
    async () => {
      try {
        setLoading(true);

        const data =
          await getNotifications(
            activeFilter,
            search
          );

        setNotifications(
          data.results
        );

        setCounts(
          data.counts
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * One effect handles both:
   * - filter changes immediately
   * - search changes with 400ms debounce
   */
  useEffect(() => {
    const delay =
      search.trim()
        ? 400
        : 0;

    const timer =
      window.setTimeout(
        () => {
          loadNotifications();
        },
        delay
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    activeFilter,
    search,
  ]);

  const latestAIAlert =
    useMemo(() => {
      return notifications.find(
        (item) =>
          item.notification_type ===
          "ai_alert"
      );
    }, [notifications]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <NotificationsHeader
        search={search}
        onSearchAction={
          setSearch
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left */}
        <aside className="space-y-4 lg:col-span-3">
          <NotificationFilters
            counts={counts}
            activeFilter={
              activeFilter
            }
            onFilterAction={
              setActiveFilter
            }
          />

          <AuraAIAlertCard
            notification={
              latestAIAlert
            }
          />
        </aside>

        {/* Timeline */}
        <section className="lg:col-span-9">
          <NotificationTimeline
            notifications={
              notifications
            }
            onRefreshAction={
              loadNotifications
            }
          />
        </section>
      </div>
    </>
  );
}