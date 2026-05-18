type OnboardingActionsProps = {
  loading: boolean;
  onSkipAction: () => void;
};

export default function OnboardingActions({
  loading,
  onSkipAction,
}: OnboardingActionsProps) {
  return (
    <div className="mt-2 flex flex-col items-center justify-between gap-4 md:flex-row">
      <button
        type="button"
        onClick={onSkipAction}
        className="px-6 py-3 text-sm font-medium text-[#565e74] transition hover:text-black"
      >
        Skip for now
      </button>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black px-10 py-4 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
      >
        {loading ? "Completing Setup..." : "Complete Setup"}
      </button>
    </div>
  );
}