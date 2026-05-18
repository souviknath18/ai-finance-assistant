import ProfileHeader from "./ProfileHeader";
import PersonalDetailsSection from "./PersonalDetailsSection";
import FinancialCoreSection from "./FinancialCoreSection";
import GoalsPreferencesCard from "./GoalsPreferencesCard";
import NotificationPreferencesCard from "./NotificationPreferencesCard";
import ProfileDangerZone from "./ProfileDangerZone";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <ProfileHeader />

      <PersonalDetailsSection />

      <FinancialCoreSection />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GoalsPreferencesCard />
        <NotificationPreferencesCard />
      </section>

      <ProfileDangerZone />
    </div>
  );
}