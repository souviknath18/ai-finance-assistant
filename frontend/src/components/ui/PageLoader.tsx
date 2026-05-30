type PageLoaderProps = {
  message?: string;
};

export default function PageLoader({
  message = "Loading data...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[calc(100vh-88px)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/15 blur-2xl" />

          <div className="relative h-12 w-12 animate-spin rounded-full border-[2.5px] border-[#dce9ff] border-t-emerald-700" />
        </div>

        <div className="text-center">
          <p className="text-[13px] font-semibold tracking-wide text-[#565e74]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}