import {
  ChevronDown,
} from "lucide-react";

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
      className="w-full rounded-2xl border border-[#e6edf9] bg-white p-4 text-left shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[#d5e2f3]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[12px] font-bold text-black">
          {question}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#565e74] transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </div>

      {isOpen && (
        <p className="mt-3 text-[12px] leading-5 text-[#565e74]">
          {answer}
        </p>
      )}
    </button>
  );
}