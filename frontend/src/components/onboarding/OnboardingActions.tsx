import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

type OnboardingActionsProps = {
  loading: boolean;
  onSkipAction: () => void;
};

export default function OnboardingActions({
  loading,
  onSkipAction,
}: OnboardingActionsProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-[#edf2fb] pt-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Skip */}
      <button
        type="button"
        onClick={onSkipAction}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center rounded-xl px-3 text-[11px] font-semibold text-[#7c839b] transition-[background-color,color] duration-200 hover:bg-[#f8faff] hover:text-black disabled:cursor-not-allowed disabled:opacity-50 sm:justify-start"
      >
        Skip for now
      </button>

      {/* Complete */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.16)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Completing Setup...
          </>
        ) : (
          <>
            <Sparkles size={13} />
            Complete Setup
            <ArrowRight size={13} />
          </>
        )}
      </button>
    </div>
  );
}