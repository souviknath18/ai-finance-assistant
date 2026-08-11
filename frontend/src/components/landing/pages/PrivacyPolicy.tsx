import {
  FileText,
  ShieldCheck,
} from "lucide-react";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "We may collect account information such as your name, email address and authentication details when you create an Aura Finance account.",
      "When you upload financial documents, the application may process transaction dates, merchant names, amounts, balances, categories and other financial information contained in those files.",
      "We may also collect basic technical information such as browser type, device information, application usage and error logs.",
    ],
  },
  {
    title: "2. How We Use Information",
    content: [
      "We use your information to provide account access, process financial documents, extract transactions, categorize expenses and generate financial insights.",
      "Information may also be used to improve application performance, detect errors, protect accounts and provide customer support.",
      "We do not intend to sell personal financial information to advertisers or unrelated third parties.",
    ],
  },
  {
    title: "3. AI Processing",
    content: [
      "Some uploaded information may be processed using artificial intelligence services to extract, categorize, search or summarize financial data.",
      "Only the information required to provide the requested feature should be sent to external AI providers.",
      "AI-generated results may contain errors and should be reviewed before making important financial decisions.",
    ],
  },
  {
    title: "4. Data Storage and Security",
    content: [
      "Aura Finance uses protected APIs, authentication controls and user-specific data separation to reduce unauthorized access.",
      "Financial documents and extracted records may be stored using cloud infrastructure and database services used by the application.",
      "No internet-based service can guarantee absolute security, so users should avoid uploading information that is not necessary for using the platform.",
    ],
  },
  {
    title: "5. Data Sharing",
    content: [
      "Information may be shared with service providers that support hosting, storage, authentication, analytics, document processing and AI functionality.",
      "We may disclose information when legally required or when necessary to protect users, the service or the public.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We may retain account information and financial records while your account remains active or as needed to provide the service.",
      "Retention periods may also depend on security, operational and legal requirements.",
    ],
  },
  {
    title: "7. Your Choices",
    content: [
      "You may update certain account information through your profile or settings page.",
      "You may request correction or deletion of your personal information by contacting the service administrator.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "This Privacy Policy may be updated as Aura Finance evolves. Material changes should be communicated through the application or website.",
    ],
  },
  {
    title: "9. Contact",
    content: [
      "For privacy-related questions or requests, contact Aura Finance through the Contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] text-[#0b1c30]">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <ShieldCheck size={18} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Privacy & Data
          </p>

          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-black sm:text-[32px] lg:text-[36px]">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[12px] leading-5 text-[#565e74] sm:text-[13px] sm:leading-6">
            This policy explains how Aura Finance may collect, use, store,
            process, and protect information when you use the platform.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e6edf9] bg-white px-3 py-1.5 shadow-[0_3px_10px_rgba(15,23,42,0.03)]">
            <FileText
              size={11}
              className="text-[#7c839b]"
            />

            <span className="text-[9px] font-semibold text-[#7c839b]">
              Last updated: July 21, 2026
            </span>
          </div>
        </div>
      </section>

      {/* Policy */}
      <section className="border-y border-[#edf2fb] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Notice */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-white text-amber-700">
                <FileText size={14} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-amber-700">
                  Important Notice
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#565e74] sm:text-[12px]">
                  This page is a general product privacy-policy template and is
                  not legal advice. Review it with a qualified legal
                  professional before using Aura Finance as a public or
                  commercial service.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-[#e6edf9] bg-[#fbfcff] shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className={`p-5 sm:p-6 ${
                  index !== sections.length - 1
                    ? "border-b border-[#edf2fb]"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-bold tracking-tight text-black sm:text-[16px]">
                      {section.title}
                    </h2>

                    <div className="mt-3 space-y-3">
                      {section.content.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-[11px] leading-5 text-[#565e74] sm:text-[12px] sm:leading-6"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/60 via-white to-[#fbfcff] p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-emerald-700">
              Privacy Questions
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-[#565e74] sm:text-[12px]">
              If you have questions about how Aura Finance handles personal
              information, use the Contact page to reach the service
              administrator.
            </p>
          </div>
        </article>
      </section>

      <LandingFooter />
    </main>
  );
}