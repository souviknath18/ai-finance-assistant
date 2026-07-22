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
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            Legal
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            This policy explains how Aura Finance may collect, use, store and
            protect information when you use the platform.
          </p>

          <p className="mt-4 text-xs font-semibold text-[#7c839b]">
            Last updated: July 21, 2026
          </p>
        </div>
      </section>

      <section className="bg-[#eff4ff] px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm sm:p-10">
          <div className="rounded-2xl border border-[#b7d0f6] bg-[#f8f9ff] p-5">
            <p className="text-sm leading-7 text-[#565e74]">
              This page is a general product privacy-policy template and is not
              legal advice. Review it with a qualified legal professional
              before using Aura Finance as a public or commercial service.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-black">
                  {section.title}
                </h2>

                <div className="mt-3 space-y-3">
                  {section.content.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-7 text-[#565e74]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>

      <LandingFooter />
    </main>
  );
}