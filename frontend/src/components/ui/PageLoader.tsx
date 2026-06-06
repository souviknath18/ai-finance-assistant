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
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl" />

          {/* Spinner */}
          <div className="relative h-10 w-10 animate-spin rounded-full border-[2.5px] border-[#dce9ff] border-t-emerald-600 border-r-indigo-500" />
        </div>

        <div className="text-center">
          <p className="text-[12px] font-semibold tracking-wide text-[#374151]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}