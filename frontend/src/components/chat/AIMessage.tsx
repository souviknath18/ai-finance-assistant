import { Sparkles } from "lucide-react";

type AIMessageProps = {
  children: React.ReactNode;
  time?: string;
};

export default function AIMessage({
  children,
  time = "Just now",
}: AIMessageProps) {
  return (
    <div className="flex max-w-3xl items-start gap-3">
      {/* Aura Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#e6edf9] bg-[#f8faff] text-black shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <Sparkles size={15} />
      </div>

      {/* Message */}
      <div className="min-w-0">
        <div className="rounded-2xl rounded-tl-md border border-[#e6edf9] bg-white px-4 py-3.5 text-[13px] leading-6 text-black shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
          {children}
        </div>

        <span className="mt-1.5 block text-[10px] font-medium text-[#8a92a5]">
          Aura • {time}
        </span>
      </div>
    </div>
  );
}