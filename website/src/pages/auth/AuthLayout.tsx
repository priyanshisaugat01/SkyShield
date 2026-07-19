import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Logo from "../../components/Logo";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  badge,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  badge?: string;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/hero-aviation.jpg"
          alt="Aircraft flying above a blanket of clouds"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/70" aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <p className="text-2xl font-medium text-text max-w-md leading-snug">
            &ldquo;SkyShield is the only tool that hasn&apos;t made me choose between
            shipping fast and sleeping at night.&rdquo;
          </p>
          <p className="mt-4 text-sm text-text-muted">
            Security Engineering, mission-critical infrastructure team
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Link to="/" aria-label="SkyShield home" className="inline-block mb-10">
            <Logo />
          </Link>
          {badge && (
            <span className="inline-block mb-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gradient-accent">
              {badge}
            </span>
          )}
          <h1 className="text-2xl font-semibold text-text">{title}</h1>
          <p className="mt-2 text-sm text-text-muted mb-8">{subtitle}</p>
          {children}
          <div className="mt-8 text-sm text-text-muted">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
