export default function ProfileDangerZone() {
  return (
    <section className="border-t border-red-100 pt-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>

          <p className="mt-1.5 text-[13px] leading-6 text-red-800">
            Permanently delete your account and all associated financial data.
          </p>
        </div>

        <button className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
          Delete Account
        </button>
      </div>
    </section>
  );
}