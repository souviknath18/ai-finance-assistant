import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#e6edf9] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row">
        {/* Brand */}
        <div className="max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
          >
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.10)]">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-emerald-900/50" />

              <Sparkles
                size={13}
                className="relative z-10"
              />
            </div>

            <h2 className="text-[14px] font-bold tracking-tight text-black">
              Aura Finance
            </h2>
          </Link>

          <p className="mt-3 text-[11px] leading-5 text-[#565e74]">
            AI-powered personal finance intelligence for organizing transactions,
            understanding spending, discovering patterns, and making sense of your money.
          </p>

          <p className="mt-3 text-[10px] text-[#8a92a5]">
            © 2026 Aura Finance AI. All rights reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterGroup
            title="Product"
            links={[
              {
                label: "Features",
                href: "/#features",
              },
              {
                label: "Pricing",
                href: "/pricing",
              },
              {
                label: "Security",
                href: "/#security",
              },
            ]}
          />

          <FooterGroup
            title="Company"
            links={[
              {
                label: "About",
                href: "/about",
              },
              {
                label: "Contact",
                href: "/contact",
              },
            ]}
          />

          <FooterGroup
            title="Legal"
            links={[
              {
                label: "Privacy",
                href: "/privacy-policy",
              },
              {
                label: "Terms",
                href: "/terms-of-service",
              },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-black">
        {title}
      </h3>

      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[11px] font-medium text-[#565e74] transition-colors hover:text-emerald-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}