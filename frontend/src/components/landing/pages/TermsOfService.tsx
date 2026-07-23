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
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            Legal
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl">
            Terms of Service
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            These terms explain the conditions for accessing and using Aura
            Finance.
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
              This page is a general terms template for your project and is not
              legal advice. Have the final version reviewed before launching
              paid subscriptions or accepting public users.
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