import { ShieldCheck } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import ActiveSessionCard from "./ActiveSessionCard";

export default function SecuritySection() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <ShieldCheck size={18} className="text-black" />
        <h2 className="text-lg font-bold text-black">Security & Access</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[#e5eeff] p-5">
          <div>
            <h3 className="text-base font-bold text-black">
              Two-Factor Authentication
            </h3>
            <p className="mt-1 text-[13px] text-[#565e74]">
              Protect your account with an extra layer of security.
            </p>
          </div>

          <ToggleSwitch enabled />
        </div>

        <div className="p-5">
          <h3 className="mb-3.5 text-base font-bold text-black">
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