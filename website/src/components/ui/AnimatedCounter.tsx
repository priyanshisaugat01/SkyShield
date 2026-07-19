import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

interface AnimatedCounterProps {
  value: string;
  numeric: boolean;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  numeric,
  suffix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(numeric ? "0" : value);

  useEffect(() => {
    if (!isInView || !numeric) return;
    const target = parseInt(value, 10);
    if (Number.isNaN(target)) return;

    const controls = animate(0, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate(current) {
        setDisplay(Math.round(current).toString());
      },
    });
    return () => controls.stop();
  }, [isInView, numeric, value]);

  return (
    <span ref={ref}>
      {display}
      {numeric ? suffix : ""}
    </span>
  );
}
