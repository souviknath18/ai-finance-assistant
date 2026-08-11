import ProfileHeader from "./ProfileHeader";
import PersonalDetailsSection from "./PersonalDetailsSection";
import FinancialCoreSection from "./FinancialCoreSection";
import GoalsPreferencesCard from "./GoalsPreferencesCard";
import NotificationPreferencesCard from "./NotificationPreferencesCard";
import ProfileDangerZone from "./ProfileDangerZone";

export default function ProfilePage() {
  return (
    <div>
      <ProfileHeader />

      <PersonalDetailsSection />

      <FinancialCoreSection />

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GoalsPreferencesCard />

        <NotificationPreferencesCard />
      </section>

      <ProfileDangerZone />
    </div>
  );
}