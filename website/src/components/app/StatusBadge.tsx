type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  success: "bg-accent-2/15 text-accent-2",
  warning: "bg-amber-400/15 text-amber-400",
  danger: "bg-danger/15 text-danger",
  info: "bg-accent/15 text-accent",
  neutral: "bg-white/10 text-text-muted",
};

const STATUS_TONE: Record<string, Tone> = {
  healthy: "success",
  passed: "success",
  passing: "success",
  active: "success",
  running: "success",
  compliant: "success",
  resolved: "success",
  ok: "success",
  approved: "success",
  low: "success",

  degraded: "warning",
  pending: "warning",
  warning: "warning",
  medium: "warning",
  "in progress": "warning",
  "in review": "warning",
  outdated: "warning",

  critical: "danger",
  failed: "danger",
  failing: "danger",
  down: "danger",
  "non-compliant": "danger",
  high: "danger",
  alarm: "danger",
  blocked: "danger",
  exposed: "danger",

  scanning: "info",
  deploying: "info",
  provisioning: "info",
  info: "info",

  archived: "neutral",
  disabled: "neutral",
  draft: "neutral",
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status.toLowerCase()] ?? "neutral";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${TONE_STYLES[tone]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
