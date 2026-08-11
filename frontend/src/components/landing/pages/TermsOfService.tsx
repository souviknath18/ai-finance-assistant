import {
  FileText,
  Scale,
} from "lucide-react";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By creating an account or using Aura Finance, you agree to these Terms of Service and the Privacy Policy.",
      "You should not use the platform if you do not agree with these terms.",
    ],
  },
  {
    title: "2. Description of the Service",
    content: [
      "Aura Finance provides tools for uploading financial files, extracting transactions, categorizing expenses, searching financial records and generating AI-powered insights.",
      "Features may change, be added, removed or temporarily unavailable as the application develops.",
    ],
  },
  {
    title: "3. Account Responsibilities",
    content: [
      "You are responsible for providing accurate account information and keeping your login credentials secure.",
      "You are responsible for all activity performed through your account unless you report unauthorized access.",
      "You must notify us if you believe your account has been compromised.",
    ],
  },
  {
    title: "4. Permitted Use",
    content: [
      "You may use Aura Finance for lawful personal financial organization and analysis.",
      "You must not attempt to access another user's data, bypass security controls, disrupt the service, upload malicious files or use the platform for illegal activities.",
    ],
  },
  {
    title: "5. Uploaded Content",
    content: [
      "You retain ownership of the documents and information you upload.",
      "By uploading content, you authorize Aura Finance to process, store and analyze it as necessary to provide the requested features.",
      "You must have the right to upload and process the information contained in your files.",
    ],
  },
  {
    title: "6. AI-Generated Information",
    content: [
      "Aura Finance may use artificial intelligence to extract, categorize, search and explain financial data.",
      "AI-generated outputs may be incomplete or inaccurate and should not be treated as guaranteed financial, legal, tax or investment advice.",
      "You remain responsible for reviewing information before making financial decisions.",
    ],
  },
  {
    title: "7. Payments and Subscriptions",
    content: [
      "Paid plans, prices and usage limits may be introduced or changed as the platform develops.",
      "Specific billing, cancellation and refund terms should be shown before users purchase a paid subscription.",
      "Until payment functionality is implemented, displayed prices should be treated as product previews.",
    ],
  },
  {
    title: "8. Service Availability",
    content: [
      "We aim to provide a reliable service but do not guarantee uninterrupted or error-free availability.",
      "The platform may be temporarily unavailable because of maintenance, infrastructure problems, security incidents or external service failures.",
    ],
  },
  {
    title: "9. Limitation of Liability",
    content: [
      "Aura Finance is provided on an as-is and as-available basis to the extent permitted by law.",
      "We are not responsible for financial losses or decisions resulting from inaccurate uploaded data, extraction errors, AI-generated output or service interruptions.",
    ],
  },
  {
    title: "10. Account Suspension or Termination",
    content: [
      "Access may be suspended or terminated if a user violates these terms, misuses the platform, threatens system security or engages in unlawful activity.",
    ],
  },
  {
    title: "11. Changes to These Terms",
    content: [
      "These terms may be updated as the platform and its features evolve. Continued use after an update may indicate acceptance of the revised terms.",
    ],
  },
  {
    title: "12. Contact",
    content: [
      "Questions about these terms can be submitted through the Aura Finance Contact page.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#f8faff] text-[#0b1c30]">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <Scale size={18} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Legal Terms
          </p>

          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-black sm:text-[32px] lg:text-[36px]">
            Terms of Service
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[12px] leading-5 text-[#565e74] sm:text-[13px] sm:leading-6">
            These terms explain the conditions for accessing and using Aura
            Finance and outline the responsibilities associated with using the
            platform.
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

      {/* Terms Content */}
      <section className="border-y border-[#edf2fb] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Legal Notice */}
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
                  This page is a general terms template for the Aura Finance
                  project and is not legal advice. Have the final version
                  reviewed by a qualified legal professional before accepting
                  public users or launching paid subscriptions.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
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
              Questions About These Terms
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-[#565e74] sm:text-[12px]">
              If you have questions about these Terms of Service, use the Aura
              Finance Contact page to reach the service administrator.
            </p>
          </div>
        </article>
      </section>

      <LandingFooter />
    </main>
  );
}