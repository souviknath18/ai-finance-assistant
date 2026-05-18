export default function ProfileDangerZone() {
  return (
    <section className="border-t border-red-100 pt-8">
      <div className="flex flex-col justify-between gap-5 rounded-3xl border border-red-100 bg-red-50 p-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>

          <p className="mt-2 text-sm leading-6 text-red-800">
            Permanently delete your account and all associated financial data.
          </p>
        </div>

        <button className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
          Delete Account
        </button>
      </div>
    </section>
  );
}