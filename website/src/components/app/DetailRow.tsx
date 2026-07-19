import type { ReactNode } from "react";

export default function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-text-muted shrink-0">{label}</span>
      <span className="text-sm text-text text-right">{value}</span>
    </div>
  );
}
