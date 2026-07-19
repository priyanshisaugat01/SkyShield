import { motion } from "motion/react";
import { LuTrendingDown } from "react-icons/lu";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import Sparkline from "../effects/Sparkline";
import {
  threatTimeline,
  incidentCards,
  heatmapCategories,
  heatmapData,
  riskTrend,
} from "../../data/threatIntelligence";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#f87171",
  high: "#fb923c",
  medium: "#facc15",
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function heatColor(value: number) {
  const opacity = 0.12 + (value / 4) * 0.75;
  return `rgba(34, 211, 238, ${opacity.toFixed(2)})`;
}

export default function AIThreatIntelligence() {
  return (
    <Section id="threat-intel">
      <SectionHeading
        eyebrow="AI Threat Intelligence"
        title="Threats surfaced the moment behavior deviates from baseline."
        description="Not a static rule list — a model that knows what normal looks like for your environment specifically."
        align="center"
      />

      <div className="grid lg:grid-cols-[1fr_1fr] gap-5 mb-5">
        {/* Live attack timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <GlassCard className="p-6 sm:p-7 h-full" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 mb-6">
              Live Attack Timeline
            </p>
            <div className="relative pl-5">
              <div className="absolute left-[3px] top-1 bottom-1 w-px bg-white/10" aria-hidden="true" />
              <div className="space-y-6">
                {threatTimeline.map((event) => (
                  <div key={event.id} className="relative">
                    <span
                      className="absolute -left-5 top-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: SEVERITY_COLOR[event.severity] }}
                      aria-hidden="true"
                    />
                    <p className="text-sm text-text leading-snug">{event.title}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {event.resource} · {event.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Risk prediction + heatmap */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <GlassCard className="p-6 sm:p-7" hover={false}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 mb-4">
                Risk Prediction
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-text">3.2 / 10</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-accent-2">
                    <LuTrendingDown size={13} aria-hidden="true" />
                    Trending down 12% over 14 days
                  </p>
                </div>
                <Sparkline data={riskTrend} width={140} height={44} />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
          >
            <GlassCard className="p-6 sm:p-7 flex-1" hover={false}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 mb-5">
                Threat Heatmap — Last 7 Days
              </p>
              <div className="flex gap-3">
                <div className="flex flex-col justify-between text-[10px] text-text-muted py-0.5 shrink-0">
                  {heatmapCategories.map((cat) => (
                    <span key={cat}>{cat}</span>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${heatmapCategories.length}, 1fr)` }}>
                    {heatmapData.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-7 gap-1">
                        {row.map((value, colIndex) => (
                          <motion.div
                            key={colIndex}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: (rowIndex * 7 + colIndex) * 0.015 }}
                            className="aspect-square rounded-sm"
                            style={{ backgroundColor: heatColor(value) }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {DAY_LABELS.map((day) => (
                      <span key={day} className="text-[9px] text-text-muted text-center">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Incident cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        {incidentCards.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
          >
            <GlassCard className="p-5 h-full">
              <span
                className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: `${SEVERITY_COLOR[incident.severity]}22`,
                  color: SEVERITY_COLOR[incident.severity],
                }}
              >
                {incident.severity}
              </span>
              <p className="mt-3 text-sm text-text leading-snug">{incident.title}</p>
              <p className="mt-2 text-xs text-text-muted">
                {incident.resource} · {incident.time}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
