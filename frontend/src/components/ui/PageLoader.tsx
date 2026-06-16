type PageLoaderProps = {
  message?: string;
};

export default function PageLoader({
  message = "Loading your workspace...",
}: PageLoaderProps) {
  return (
    <div className="flex h-[calc(100vh-88px)] w-full items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          {/* Aura Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-black/5 blur-3xl" />

          {/* Spinner */}
          <div className="relative h-10 w-10 animate-spin rounded-full bg-[conic-gradient(from_0deg,#047857,#10b981,#a7f3d0,#dce9ff,#dce9ff)]">
            <div className="absolute inset-[2.5px] rounded-full bg-[#f7faf8]" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[12px] font-semibold tracking-wide text-[#4b5563]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}