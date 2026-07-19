import type { ElementType, ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  as = "h2",
  align = "left",
}: SectionHeadingProps) {
  const Heading: ElementType = as;

  return (
    <div className={`mb-14 ${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}`}>
      <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
        {eyebrow}
      </span>
      <Heading className="font-sans font-semibold leading-[1.1] text-3xl sm:text-4xl lg:text-[2.75rem] text-text tracking-tight">
        {title}
      </Heading>
      {description && (
        <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
