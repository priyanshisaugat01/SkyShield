import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";
import GlassCard from "../ui/GlassCard";
import Sparkline from "./Sparkline";

interface LiveMetricCardProps {
  icon: IconType;
  label: string;
  unit: string;
  base: number;
  jitter: number;
  decimals?: number;
  seedTrend?: number[];
}

const HISTORY_LENGTH = 20;
const TICK_MS = 2200;

function nextValue(current: number, base: number, jitter: number) {
  const pull = (base - current) * 0.15;
  const noise = (Math.random() - 0.5) * jitter;
  return Math.max(0, current + pull + noise);
}

export default function LiveMetricCard({
  icon: Icon,
  label,
  unit,
  base,
  jitter,
  decimals = 0,
  seedTrend,
}: LiveMetricCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [series, setSeries] = useState<number[]>(
    () => seedTrend ?? Array.from({ length: HISTORY_LENGTH }, () => base)
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setSeries((current) => {
        const last = current[current.length - 1] ?? base;
        const next = nextValue(last, base, jitter);
        return [...current.slice(1), next];
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [base, jitter, prefersReducedMotion]);

  const currentValue = series[series.length - 1];

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon size={16} className="text-accent-2" aria-hidden="true" />
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-accent-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" aria-hidden="true" />
          Live
        </span>
      </div>
      <p className="text-2xl font-semibold text-text">
        {currentValue.toFixed(decimals)}
        <span className="text-sm text-text-muted ml-1">{unit}</span>
      </p>
      <p className="text-xs text-text-muted mb-2">{label}</p>
      <Sparkline data={series} className="w-full" />
    </GlassCard>
  );
}
