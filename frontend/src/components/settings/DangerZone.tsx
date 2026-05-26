import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <AlertTriangle size={18} className="text-red-600" />
        <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-base font-bold text-red-600">
              Delete Account
            </h3>

            <p className="mt-1 text-[13px] leading-6 text-[#565e74]">
              Permanently remove your account and all associated financial data.
              This action cannot be undone.
            </p>
          </div>

          <button className="rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
            Delete Forever
          </button>
        </div>
      </div>
    </section>
  );
}