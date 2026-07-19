import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export default function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let frame = 0;
    function handleMove(event: MouseEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty("--x", `${event.clientX}px`);
        ref.current?.style.setProperty("--y", `${event.clientY}px`);
      });
    }

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500"
      style={{
        background: prefersReducedMotion
          ? undefined
          : "radial-gradient(650px circle at var(--x, 50%) var(--y, 25%), rgba(59,130,246,0.07), transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}
