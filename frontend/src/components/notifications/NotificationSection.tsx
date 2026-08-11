type NotificationSectionProps = {
  title: string;
  children: React.ReactNode;
  muted?: boolean;
  faded?: boolean;
};

export default function NotificationSection({
  title,
  children,
  muted = false,
  faded = false,
}: NotificationSectionProps) {
  return (
    <section
      className={
        faded
          ? "opacity-75 transition-opacity hover:opacity-100"
          : ""
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <h2
          className={`text-[13px] font-bold text-black ${
            muted ? "opacity-70" : ""
          } ${faded ? "opacity-60" : ""}`}
        >
          {title}
        </h2>

        <div className="h-px flex-1 bg-[#e6edf9]" />
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}