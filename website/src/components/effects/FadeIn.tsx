import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 800,
  className = "",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(Boolean(prefersReducedMotion));

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, prefersReducedMotion]);

  return (
    <div
      className={`transition-opacity ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
