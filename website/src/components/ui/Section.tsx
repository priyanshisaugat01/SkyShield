import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  reveal?: "fade" | "blur";
  bleed?: boolean;
}

const VARIANTS = {
  fade: {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
  },
  blur: {
    initial: { opacity: 0, y: 36, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

export default function Section({
  id,
  children,
  className = "",
  reveal = "fade",
  bleed = false,
}: SectionProps) {
  const variant = VARIANTS[reveal];

  return (
    <motion.section
      id={id}
      initial={variant.initial}
      whileInView={variant.whileInView}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className={`relative py-24 ${bleed ? "" : "px-6 sm:px-8 lg:px-12"} ${className}`}
    >
      {bleed ? children : <div className="max-w-6xl mx-auto">{children}</div>}
    </motion.section>
  );
}
