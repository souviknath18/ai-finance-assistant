import {
  BadgeCheck,
  Edit,
} from "lucide-react";

import ProfileAvatar from "./ProfileAvatar";
import ProfileInfoCard from "./ProfileInfoCard";

export default function PersonalDetailsSection() {
  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-black">
            Personal Details
          </h2>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            Manage your basic account
            identity and contact
            information.
          </p>
        </div>

        <button
          type="button"
          className="w-fit shrink-0 text-[11px] font-bold text-emerald-700 transition hover:opacity-70"
        >
          Edit All
        </button>
      </div>

      <div className="space-y-4">
        <ProfileAvatar />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileInfoCard
            label="Full Name"
            value="Alexander Sterling"
            icon={
              <Edit size={15} />
            }
          />

          <ProfileInfoCard
            label="Email Address"
            value="a.sterling@aurafinance.io"
            icon={
              <BadgeCheck
                size={15}
                className="text-emerald-700"
              />
            }
          />

          <ProfileInfoCard
            label="Password"
            value="••••••••••••••••"
            buttonText="Update Password"
            className="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}