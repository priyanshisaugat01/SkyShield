import type { IconType } from "react-icons";
import GlassCard from "../ui/GlassCard";
import AnimatedCounter from "../ui/AnimatedCounter";

interface StatTileProps {
  icon: IconType;
  label: string;
  value: string;
  numeric?: boolean;
  suffix?: string;
  trend?: string;
  trendPositive?: boolean;
}

export default function StatTile({
  icon: Icon,
  label,
  value,
  numeric = false,
  suffix = "",
  trend,
  trendPositive = true,
}: StatTileProps) {
  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon size={16} className="text-accent-2" aria-hidden="true" />
        </div>
        {trend && (
          <span className={`text-[11px] font-medium ${trendPositive ? "text-accent-2" : "text-danger"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-text">
        {numeric ? <AnimatedCounter value={value} numeric suffix={suffix} /> : value}
      </p>
      <p className="mt-1 text-xs text-text-muted">{label}</p>
    </GlassCard>
  );
}
