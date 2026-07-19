import { useState } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import Logo from "./Logo";
import Button from "./ui/Button";
import MagneticButton from "./effects/MagneticButton";

const NAV_LINKS = [
  { id: "preview", label: "Platform" },
  { id: "operations", label: "Operations" },
  { id: "architecture", label: "Architecture" },
  { id: "security", label: "Security" },
  { id: "compliance", label: "Compliance" },
  { id: "threat-intel", label: "Threat Intel" },
  { id: "monitoring", label: "Monitoring" },
  { id: "pipeline", label: "Pipeline" },
];

// Not yet a real page/section — kept as a placeholder link rather than
// mis-mapped to an unrelated anchor.
const DOCS_LINK = { label: "Documentation", href: "#" };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeId = useScrollSpy(["home", ...NAV_LINKS.map((link) => link.id)]);

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 md:px-8 lg:px-10 pt-6">
      <nav
        className="liquid-glass max-w-[1400px] mx-auto flex items-center justify-between gap-6 rounded-xl pl-5 pr-3 py-2.5"
        aria-label="Primary"
      >
        <a href="#home" aria-label="SkyShield home" className="shrink-0">
          <Logo />
        </a>

        <ul className="hidden xl:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={activeId === link.id ? "page" : undefined}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  activeId === link.id
                    ? "text-text"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={DOCS_LINK.href}
              className="text-sm font-medium text-text-muted hover:text-text transition-colors whitespace-nowrap"
            >
              {DOCS_LINK.label}
            </a>
          </li>
        </ul>

        <div className="hidden xl:flex items-center shrink-0">
          <MagneticButton>
            <Button href="/login" variant="primary" className="text-xs px-5 py-2.5 whitespace-nowrap">
              Launch Platform
            </Button>
          </MagneticButton>
        </div>

        <button
          type="button"
          className="xl:hidden text-text p-2"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="text-xl" aria-hidden="true">
            {isOpen ? "✕" : "☰"}
          </span>
        </button>
      </nav>

      {isOpen && (
        <ul
          id="mobile-menu"
          className="liquid-glass xl:hidden max-w-6xl mx-auto mt-2 flex flex-col gap-1 rounded-xl px-6 py-4"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setIsOpen(false)}
                aria-current={activeId === link.id ? "page" : undefined}
                className={`block py-2.5 text-sm ${
                  activeId === link.id ? "text-accent" : "text-text-muted"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={DOCS_LINK.href}
              onClick={() => setIsOpen(false)}
              className="block py-2.5 text-sm text-text-muted"
            >
              {DOCS_LINK.label}
            </a>
          </li>
          <li className="pt-3">
            <Button href="/login" variant="primary" className="w-full" onClick={() => setIsOpen(false)}>
              Launch Platform
            </Button>
          </li>
        </ul>
      )}
    </header>
  );
}
