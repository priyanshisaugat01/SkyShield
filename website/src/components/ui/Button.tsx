import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonAsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonProps = ButtonAsAnchor | ButtonAsButton;

export default function Button({ children, variant = "primary", className = "", ...rest }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 font-sans text-sm font-medium transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none";
  const styles =
    variant === "primary"
      ? "gradient-accent text-white shadow-[0_4px_24px_-8px_rgba(59,130,246,0.55)] hover:shadow-[0_8px_36px_-8px_rgba(59,130,246,0.75)] hover:-translate-y-0.5"
      : "border border-white/15 text-text hover:border-accent/50 hover:bg-white/5";

  if ("href" in rest && rest.href !== undefined) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={`${base} ${styles} ${className}`} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...buttonProps}>
      {children}
    </button>
  );
}
