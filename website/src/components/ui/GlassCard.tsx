import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl transition-all duration-300 ${
        hover
          ? "hover:border-accent/40 hover:shadow-[0_0_44px_-14px_rgba(59,130,246,0.65)] hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
