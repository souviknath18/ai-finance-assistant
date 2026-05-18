import NotificationsHeader from "./NotificationsHeader";
import NotificationFilters from "./NotificationFilters";
import AuraAIAlertCard from "./AuraAIAlertCard";
import NotificationTimeline from "./NotificationTimeline";

export default function NotificationsPage() {
  return (
    <>
      <NotificationsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-3">
          <NotificationFilters />
          <AuraAIAlertCard />
        </aside>

        <section className="lg:col-span-9">
          <NotificationTimeline />
        </section>
      </div>
    </>
  );
}