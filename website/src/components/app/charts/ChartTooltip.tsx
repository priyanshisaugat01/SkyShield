interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { name: string; value: number | string; color?: string }[];
}

export default function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-card/95 backdrop-blur-xl px-3.5 py-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
      {label && <p className="text-xs text-text-muted mb-1">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-medium text-text flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color ?? "#22d3ee" }}
            aria-hidden="true"
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}
