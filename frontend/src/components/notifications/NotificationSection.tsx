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
    <section className={faded ? "opacity-70 transition hover:opacity-100" : ""}>
      <div className="mb-4 flex items-center gap-3">
        <h2
          className={`text-lg font-bold text-black ${
            muted ? "opacity-70" : ""
          } ${faded ? "opacity-50" : ""}`}
        >
          {title}
        </h2>

        <div className="h-px flex-1 bg-[#c6c6cd]/50" />
      </div>

      <div className="space-y-3">{children}</div>
    </section>
  );
}