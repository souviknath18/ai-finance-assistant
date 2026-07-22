import Link from "next/link";

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
    <footer className="relative z-10 border-t border-[#d3e4fe]/60 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <h2 className="text-base font-bold text-black">
            Aura Finance
          </h2>

          <p className="mt-1.5 text-[12px] text-[#565e74] sm:text-[13px]">
            © 2026 Aura Finance AI. Precision in financial autonomy.
          </p>
        </div>

        <nav
          aria-label="Authentication footer navigation"
          className="flex flex-wrap justify-center gap-4 text-[12px] text-[#565e74] sm:gap-5 sm:text-[13px]"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-black hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}