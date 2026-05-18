import SettingsHeader from "./SettingsHeader";
import AIPersonalizationCard from "./AIPersonalizationCard";
import AccountOverviewCard from "./AccountOverviewCard";
import SecuritySection from "./SecuritySection";
import AIPrivacySection from "./AIPrivacySection";
import DangerZone from "./DangerZone";

export default function SettingsPage() {
  return (
    <>
      <SettingsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-4">
          <AIPersonalizationCard />
          <AccountOverviewCard />
        </aside>

        <section className="space-y-10 lg:col-span-8">
          <SecuritySection />
          <AIPrivacySection />
          <DangerZone />
        </section>
      </div>
    </>
  );
}