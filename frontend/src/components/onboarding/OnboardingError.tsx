import {
  AlertCircle,
} from "lucide-react";

export default function OnboardingError({
  error,
}: {
  error: string;
}) {
  if (!error) {
    return null;
  }

  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-3.5 py-3 text-red-700">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600">
        <AlertCircle size={13} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-red-600">
          Setup Issue
        </p>

        <p className="mt-1 text-[11px] leading-5 text-red-700">
          {error}
        </p>
      </div>
    </div>
  );
}