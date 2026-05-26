export default function LandingFooter() {
  return (
    <footer className="border-t border-[#dce9ff] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:flex lg:justify-between lg:px-8">
        <div>
          <h2 className="text-lg font-bold text-black">
            Aura Finance
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-[#565e74]">
            © 2026 Aura Finance AI. Precision in financial autonomy.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <FooterGroup
            title="Company"
            links={["About", "Contact"]}
          />

          <FooterGroup
            title="Legal"
            links={["Privacy Policy", "Terms of Service"]}
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
  links: string[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-black">
        {title}
      </h3>

      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a className="text-sm text-[#565e74] transition hover:text-black hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}