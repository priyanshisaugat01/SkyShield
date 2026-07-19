import { FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";
import Logo from "./Logo";
import Button from "./ui/Button";
import MagneticButton from "./effects/MagneticButton";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Product Preview", href: "#preview" },
      { label: "Security Operations", href: "#operations" },
      { label: "Architecture", href: "#architecture" },
      { label: "Infrastructure Security", href: "#security" },
    ],
  },
  {
    heading: "Operate",
    links: [
      { label: "Compliance", href: "#compliance" },
      { label: "Threat Intelligence", href: "#threat-intel" },
      { label: "Live Monitoring", href: "#monitoring" },
      { label: "DevSecOps Pipeline", href: "#pipeline" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-white/10 px-6 sm:px-8 lg:px-12 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 rounded-2xl liquid-glass px-8 py-8 mb-16 text-center lg:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-text">
              See SkyShield running against your own AWS account.
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              A live walkthrough, not a slide deck — 30 minutes with an engineer.
            </p>
          </div>
          <MagneticButton>
            <Button href="/login" variant="primary" className="shrink-0">
              Launch Platform
            </Button>
          </MagneticButton>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo showSubtitle />
            <p className="mt-5 text-sm text-text-muted max-w-xs leading-relaxed">
              Security and compliance automation for enterprise cloud infrastructure — built for teams who can&apos;t afford to slow down.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="SkyShield on LinkedIn"
                className="text-text-muted hover:text-accent transition-colors"
              >
                <FaLinkedin size={18} aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="SkyShield on X"
                className="text-text-muted hover:text-accent transition-colors"
              >
                <FaXTwitter size={18} aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="SkyShield on GitHub"
                className="text-text-muted hover:text-accent transition-colors"
              >
                <FaGithub size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-text mb-4">{col.heading}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} SkyShield, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-text transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-text transition-colors">
              Terms of Service
            </a>
            <a href="#home" className="text-accent hover:text-text transition-colors">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
