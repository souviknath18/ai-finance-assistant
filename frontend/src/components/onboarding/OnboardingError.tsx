import { AlertCircle } from "lucide-react";

export default function OnboardingError({ error }: { error: string }) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-600">
      <AlertCircle size={15} />
      {error}
    </div>
  );
}