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
    <div className="flex max-w-[90%] gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">
        <Sparkles size={16} />
      </div>

      <div className="space-y-1.5">
        <div className="rounded-2xl rounded-tl-none bg-[#eff4ff] p-4 text-[13px] leading-6 text-black shadow-sm">
          {children}
        </div>

        <span className="text-[11px] font-semibold text-[#7c839b]">
          {time}
        </span>
      </div>
    </div>
  );
}