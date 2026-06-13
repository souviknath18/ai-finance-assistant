import { ChevronDown } from "lucide-react";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

export default function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: FAQItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-[#eff4ff] p-4 text-left transition hover:bg-[#dce9ff]"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[14px] font-bold text-black">{question}</p>

        <ChevronDown
          size={18}
          className={`text-[#565e74] transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <p className="mt-3 text-[13px] leading-6 text-[#565e74]">
          {answer}
        </p>
      )}
    </button>
  );
}