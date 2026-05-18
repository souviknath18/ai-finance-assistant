import { ShieldCheck } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import ActiveSessionCard from "./ActiveSessionCard";

export default function SecuritySection() {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <ShieldCheck size={22} className="text-black" />
        <h2 className="text-2xl font-bold text-black">Security & Access</h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#dce9ff] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-5 border-b border-[#e5eeff] p-6">
          <div>
            <h3 className="text-lg font-bold text-black">
              Two-Factor Authentication
            </h3>
            <p className="mt-1 text-sm text-[#565e74]">
              Protect your account with an extra layer of security.
            </p>
          </div>

          <ToggleSwitch enabled />
        </div>

        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold text-black">
            Active Sessions
          </h3>

          <div className="space-y-4">
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