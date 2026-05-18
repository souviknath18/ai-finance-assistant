import ProfileInfoCard from "./ProfileInfoCard";
import { BadgeCheck, Edit } from "lucide-react";

export default function PersonalDetailsSection() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Personal Details</h2>
          <p className="mt-1 text-sm text-[#565e74]">
            Manage your basic account identity and contact information.
          </p>
        </div>

        <button className="text-sm font-bold text-emerald-700 hover:underline">
          Edit All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileInfoCard
          label="Full Name"
          value="Alexander Sterling"
          icon={<Edit size={18} />}
        />

        <ProfileInfoCard
          label="Email Address"
          value="a.sterling@aurafinance.io"
          icon={<BadgeCheck size={18} className="text-emerald-700" />}
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