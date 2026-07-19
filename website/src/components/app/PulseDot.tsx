const TONE_COLOR: Record<string, string> = {
  success: "bg-accent-2",
  danger: "bg-danger",
  warning: "bg-amber-400",
};

export default function PulseDot({ tone = "success", label }: { tone?: "success" | "danger" | "warning"; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
      <span className="relative flex w-2 h-2">
        <span className={`absolute inline-flex h-full w-full rounded-full ${TONE_COLOR[tone]} opacity-75 animate-ping`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${TONE_COLOR[tone]}`} />
      </span>
      {label}
    </span>
  );
}
