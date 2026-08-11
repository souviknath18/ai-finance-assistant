import { ShieldCheck } from "lucide-react";

import ToggleSwitch from "./ToggleSwitch";
import ActiveSessionCard from "./ActiveSessionCard";

export default function SecuritySection() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck
          size={16}
          className="text-emerald-700"
        />

        <h2 className="text-[15px] font-bold text-black">
          Security & Access
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf2fb] p-5">
          <div>
            <h3 className="text-[13px] font-bold text-black">
              Two-Factor Authentication
            </h3>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Protect your account with an extra layer of security.
            </p>
          </div>

          <ToggleSwitch enabled />
        </div>

        <div className="p-5">
          <h3 className="mb-3 text-[13px] font-bold text-black">
            Active Sessions
          </h3>

          <div className="space-y-3">
            <ActiveSessionCard
              device="MacOS • Chrome 119"
              location="San Francisco, USA • Current Session"
              active
            />

            <ActiveSessionCard
              device="iPhone 15 Pro • Aura App"
              location="New York, USA • 2 hours ago"
            />
          </div>
        </div>
      </div>
    </section>
  );
}