import {
  Monitor,
  Smartphone,
} from "lucide-react";

type ActiveSessionCardProps = {
  device: string;
  location: string;
  active?: boolean;
};

export default function ActiveSessionCard({
  device,
  location,
  active = false,
}: ActiveSessionCardProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border p-3.5 ${
        active
          ? "border-emerald-100 bg-emerald-50/40"
          : "border-[#e6edf9] bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            active
              ? "border-emerald-100 bg-white text-emerald-700"
              : "border-[#e6edf9] bg-[#f8f9ff] text-[#565e74]"
          }`}
        >
          {active ? (
            <Monitor size={16} />
          ) : (
            <Smartphone size={16} />
          )}
        </div>

        <div>
          <p className="text-[12px] font-bold text-black">
            {device}
          </p>

          <p className="mt-0.5 text-[10px] text-[#7c839b]">
            {location}
          </p>
        </div>
      </div>

      {active ? (
        <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          Active
        </span>
      ) : (
        <button className="text-[10px] font-bold uppercase tracking-wide text-red-600">
          Revoke
        </button>
      )}
    </div>
  );
}