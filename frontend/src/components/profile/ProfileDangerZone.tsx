import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function ProfileDangerZone() {
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

      <div className="rounded-3xl border border-red-100 bg-red-50/60 p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-white text-red-600">
              <Trash2 size={16} />
            </div>

            <div>
              <h3 className="text-[13px] font-bold text-red-600">
                Delete Account
              </h3>

              <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
                Permanently delete your account and all associated financial
                data. This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(220,38,38,0.16)]"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
}