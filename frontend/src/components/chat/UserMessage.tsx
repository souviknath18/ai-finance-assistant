type UserMessageProps = {
  children: React.ReactNode;
  time?: string;
};

export default function UserMessage({
  children,
  time = "Just now",
}: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-2xl">
        <div className="rounded-2xl rounded-tr-md bg-black px-4 py-3.5 text-[13px] leading-6 text-white shadow-[0_6px_18px_rgba(15,23,42,0.12)]">
          {children}
        </div>

        <span className="mt-1.5 block text-right text-[10px] font-medium text-[#8a92a5]">
          You • {time}
        </span>
      </div>
    </div>
  );
}