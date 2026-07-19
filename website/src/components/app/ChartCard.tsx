import type { ReactNode } from "react";
import GlassCard from "../ui/GlassCard";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, description, action, children, className = "" }: ChartCardProps) {
  return (
    <GlassCard hover={false} className={`p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  );
}
