type PageLoaderProps = {
  message?: string;
};

export default function PageLoader({
  message = "Loading your workspace...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Spinner */}
        <div className="relative h-8 w-8 animate-spin rounded-full bg-[conic-gradient(from_0deg,#047857,#10b981,#a7f3d0,#dce9ff,#dce9ff)]">
          <div className="absolute inset-[2.5px] rounded-full bg-[#f8f9ff]" />
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-wide text-[#4b5563]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}