import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <AlertTriangle size={22} className="text-red-600" />
        <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
      </div>

      <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-bold text-red-600">
              Delete Account
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#565e74]">
              Permanently remove your account and all associated financial data.
              This action cannot be undone.
            </p>
          </div>

          <button className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
            Delete Forever
          </button>
        </div>
      </div>
    </section>
  );
}