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
      className={`flex items-center justify-between gap-5 rounded-2xl border p-4 ${
        active ? "border-[#dce9ff] bg-[#f8f9ff]" : "border-[#e5eeff] bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-[#565e74]">
          {active ? <Monitor size={22} /> : <Smartphone size={22} />}
        </div>

        <div>
          <p className="text-sm font-bold text-black">{device}</p>
          <p className="mt-1 text-xs font-semibold text-[#565e74]">
            {location}
          </p>
        </div>
      </div>

      {active ? (
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
          Active
        </span>
      ) : (
        <button className="text-xs font-bold uppercase tracking-wide text-red-600">
          Revoke
        </button>
      )}
    </div>
  );
}