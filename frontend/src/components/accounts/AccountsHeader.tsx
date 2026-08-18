import {
  Landmark,
  Plus,
} from "lucide-react";

type AccountsHeaderProps = {
  onConnectAction: () => void;
};

export default function AccountsHeader({
  onConnectAction,
}: AccountsHeaderProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          Connected Accounts
        </h1>

        <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
          Connect your financial accounts so
          Aura can automatically organize
          transactions and continuously
          generate personalized financial
          insights.
        </p>
      </div>

      <button
        type="button"
        onClick={onConnectAction}
        className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)]"
      >
        <Plus size={15} />

        Connect Account
      </button>
    </section>
  );
}