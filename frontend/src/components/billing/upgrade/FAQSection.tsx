"use client";

import { useState } from "react";
import FAQItem from "./FAQItem";

const faqs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time from your billing settings.",
  },
  {
    question: "How does the 20% yearly discount work?",
    answer:
      "Yearly billing gives you a discounted monthly equivalent compared to paying month by month.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "You can use major cards and supported digital payment methods depending on your billing provider.",
  },
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="mt-10 rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-center text-xl font-bold text-black">
        Frequently Asked Questions
      </h2>

      <div className="mx-auto max-w-4xl space-y-3">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFaq === index}
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}