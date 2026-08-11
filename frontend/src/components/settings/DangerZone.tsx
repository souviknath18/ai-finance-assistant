import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle
          size={15}
          className="text-red-600"
        />

        <h2 className="text-[15px] font-bold text-red-600">
          Danger Zone
        </h2>
      </div>

      <div className="rounded-3xl border border-red-100 bg-red-50/70 p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-[13px] font-bold text-red-600">
              Delete Account
            </h3>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Permanently remove your account and all associated financial
              data. This action cannot be undone.
            </p>
          </div>

          <button className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-red-600 px-4 text-[12px] font-bold text-white transition hover:opacity-90">
            Delete Forever
          </button>
        </div>
      </div>
    </section>
  );
}