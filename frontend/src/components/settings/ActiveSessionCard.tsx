import { Monitor, Smartphone } from "lucide-react";

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
        active ? "border-[#dce9ff] bg-[#f8f9ff]" : "border-[#e5eeff] bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-[#565e74]">
          {active ? <Monitor size={18} /> : <Smartphone size={18} />}
        </div>

        <div>
          <p className="text-[13px] font-bold text-black">{device}</p>
          <p className="mt-1 text-[11px] font-semibold text-[#565e74]">
            {location}
          </p>
        </div>
      </div>

      {active ? (
        <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
          Active
        </span>
      ) : (
        <button className="text-[11px] font-bold uppercase tracking-wide text-red-600">
          Revoke
        </button>
      )}
    </div>
  );
}