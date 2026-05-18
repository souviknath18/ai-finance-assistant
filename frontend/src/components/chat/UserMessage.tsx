type UserMessageProps = {
  children: React.ReactNode;
  time?: string;
};

export default function UserMessage({
  children,
  time = "2 minutes ago",
}: UserMessageProps) {
  return (
    <div className="ml-auto flex max-w-[85%] flex-row-reverse gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c6c6cd] bg-[#dce9ff] font-bold text-black">
        S
      </div>

      <div className="space-y-2 text-right">
        <div className="rounded-3xl rounded-tr-none bg-black p-5 text-sm leading-7 text-white shadow-sm">
          {children}
        </div>

        <span className="text-xs font-semibold text-[#7c839b]">{time}</span>
      </div>
    </div>
  );
}