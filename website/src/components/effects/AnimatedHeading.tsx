import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface AnimatedHeadingProps {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  initialDelay?: number;
  charDelay?: number;
}

const CHAR_TRANSITION_MS = 500;
// Built via charCode rather than a literal escape to avoid any ambiguity
// between a real non-breaking space and a plain collapsible space.
const NBSP = String.fromCharCode(160);

function Char({
  char,
  delay,
  started,
}: {
  char: string;
  delay: number;
  started: boolean;
}) {
  return (
    <span
      className="inline-block transition-[opacity,transform] ease-out"
      style={{
        opacity: started ? 1 : 0,
        transform: started ? "translateX(0)" : "translateX(-18px)",
        transitionDuration: `${CHAR_TRANSITION_MS}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {char === " " ? NBSP : char}
    </span>
  );
}

export default function AnimatedHeading({
  text,
  as = "h1",
  className = "",
  initialDelay = 200,
  charDelay = 30,
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const [started, setStarted] = useState(Boolean(prefersReducedMotion));
  const Heading = as;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setStarted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay, prefersReducedMotion]);

  const lines = text.split("\n");

  return (
    <Heading className={className}>
      {lines.map((line, lineIndex) => {
        // Characters are grouped per-word inside a `whitespace-nowrap` span
        // so the browser can only break between words, never mid-word —
        // splitting every glyph into its own inline-block otherwise creates
        // spurious break opportunities inside words.
        const words = line.split(" ");
        let charCursor = 0;

        return (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => {
              const wordChars = [...word].map((char) => {
                const delay = lineIndex * line.length * charDelay + charCursor * charDelay;
                charCursor += 1;
                return { char, delay };
              });
              const spaceDelay =
                wordIndex < words.length - 1
                  ? lineIndex * line.length * charDelay + charCursor * charDelay
                  : null;
              if (spaceDelay !== null) charCursor += 1;

              return (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                  {wordChars.map(({ char, delay }, charIndex) => (
                    <Char key={charIndex} char={char} delay={delay} started={started} />
                  ))}
                  {spaceDelay !== null && (
                    <Char char=" " delay={spaceDelay} started={started} />
                  )}
                </span>
              );
            })}
          </span>
        );
      })}
    </Heading>
  );
}
