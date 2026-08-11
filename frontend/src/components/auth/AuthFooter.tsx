import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms of Service",
    href: "/terms-of-service",
  },
];

export default function AuthFooter() {
  return (
    <footer className="relative z-10 border-t border-[#e6edf9] bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 text-center md:justify-start md:text-left">
          {/* Logo - hidden on mobile */}
          <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.10)] sm:flex">
            <Sparkles size={13} />
          </div>

          {/* Brand Text */}
          <div>
            <h2 className="text-[13px] font-bold tracking-tight text-black">
              Aura Finance
            </h2>

            <p className="mt-0.5 text-[10px] leading-4 text-[#7c839b] sm:text-[11px]">
              © 2026 Aura Finance AI. Precision in financial autonomy.
            </p>
          </div>
        </div>

        {/* Links */}
        <nav
          aria-label="Authentication footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#565e74] sm:gap-x-5"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}