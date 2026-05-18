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
    <div className="flex max-w-[90%] gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
        <Sparkles size={18} />
      </div>

      <div className="space-y-2">
        <div className="rounded-3xl rounded-tl-none bg-[#eff4ff] p-5 text-sm leading-7 text-black shadow-sm">
          {children}
        </div>

        <span className="text-xs font-semibold text-[#7c839b]">{time}</span>
      </div>
    </div>
  );
}