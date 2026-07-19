import type { IconType } from "react-icons";

interface BadgeProps {
  label: string;
  icon?: IconType;
}

export default function Badge({ label, icon: Icon }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-text-muted">
      {Icon && <Icon size={14} aria-hidden="true" />}
      {label}
    </span>
  );
}
