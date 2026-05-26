type UserMessageProps = {
  children: React.ReactNode;
  time?: string;
};

export default function UserMessage({
  children,
  time = "2 minutes ago",
}: UserMessageProps) {
  return (
    <div className="ml-auto flex max-w-[85%] flex-row-reverse gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c6c6cd] bg-[#dce9ff] text-[13px] font-bold text-black">
        S
      </div>

      <div className="space-y-1.5 text-right">
        <div className="rounded-2xl rounded-tr-none bg-black p-4 text-[13px] leading-6 text-white shadow-sm">
          {children}
        </div>

        <span className="text-[11px] font-semibold text-[#7c839b]">
          {time}
        </span>
      </div>
    </div>
  );
}