import ProfileInfoCard from "./ProfileInfoCard";
import { BadgeCheck, Edit } from "lucide-react";

export default function PersonalDetailsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-black">Personal Details</h2>
          <p className="mt-1 text-[13px] leading-6 text-[#565e74]">
            Manage your basic account identity and contact information.
          </p>
        </div>

        <button className="shrink-0 text-[13px] font-bold text-emerald-700 hover:underline">
          Edit All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProfileInfoCard
          label="Full Name"
          value="Alexander Sterling"
          icon={<Edit size={16} />}
        />

        <ProfileInfoCard
          label="Email Address"
          value="a.sterling@aurafinance.io"
          icon={<BadgeCheck size={16} className="text-emerald-700" />}
        />

        <ProfileInfoCard
          label="Password"
          value="••••••••••••••••"
          buttonText="Update Password"
          className="md:col-span-2"
        />
      </div>
    </section>
  );
}