import { motion } from "motion/react";
import { LuContainer, LuActivity, LuBellRing } from "react-icons/lu";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import TiltCard from "../effects/TiltCard";
import AnimatedCounter from "../ui/AnimatedCounter";
import Sparkline from "../effects/Sparkline";
import LiveActivityFeed from "../effects/LiveActivityFeed";
import { opsMetrics, dockerBreakdown, cpuSparkline, alertPreview } from "../../data/securityOpsMetrics";

function parseValue(value: string) {
  const match = value.match(/^([\d,]+)/);
  return match ? match[1].replace(/,/g, "") : value;
}

function suffixOf(value: string) {
  const match = value.match(/^[\d,]+(.*)$/);
  return match ? match[1] : "";
}

export default function SecurityOperationsDashboard() {
  const totalVulns = dockerBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <Section id="operations">
      <SectionHeading
        eyebrow="Security Operations Dashboard"
        title="Everything running in production, observed in one place."
        description="A live snapshot of the same widgets your team sees inside the SkyShield console."
        align="center"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {opsMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: "easeOut" }}
          >
            <TiltCard>
              <GlassCard className="p-5 h-full">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <metric.icon size={17} className="text-accent-2" aria-hidden="true" />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${metric.trendPositive ? "text-accent-2" : "text-danger"}`}
                  >
                    {metric.trend}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-text">
                  <AnimatedCounter value={parseValue(metric.value)} numeric suffix={suffixOf(metric.value)} />
                </p>
                <p className="mt-1 text-xs text-text-muted">{metric.label}</p>
              </GlassCard>
            </TiltCard>
          </motion.div>
        ))}

        {/* Docker Security breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
        >
          <GlassCard className="p-5 h-full" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <LuContainer size={17} className="text-accent-2" aria-hidden="true" />
              </div>
              <span className="text-2xl font-semibold text-text">{totalVulns}</span>
            </div>
            <p className="text-xs text-text-muted mb-3">Container Vulnerabilities</p>
            <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5">
              {dockerBreakdown.map((item) => (
                <div
                  key={item.label}
                  style={{ width: `${(item.value / totalVulns) * 100}%`, backgroundColor: item.color }}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* CloudWatch sparkline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        >
          <GlassCard className="p-5 h-full" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <LuActivity size={17} className="text-accent-2" aria-hidden="true" />
              </div>
              <span className="text-xl font-semibold text-text">42%</span>
            </div>
            <p className="text-xs text-text-muted mb-2">CloudWatch — Avg CPU</p>
            <Sparkline data={cpuSparkline} className="w-full" />
          </GlassCard>
        </motion.div>

        {/* Security Alerts preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.42, ease: "easeOut" }}
          className="sm:col-span-2 lg:col-span-2"
        >
          <GlassCard className="p-5 h-full" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <LuBellRing size={17} className="text-accent-2" aria-hidden="true" />
                </div>
                <p className="text-xs text-text-muted">Security Alerts</p>
              </div>
              <span className="text-xl font-semibold text-text">{alertPreview.length + 4}</span>
            </div>
            <ul className="space-y-2.5">
              {alertPreview.map((alert) => (
                <li key={alert.label} className="flex items-center gap-2.5 text-xs">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: alert.color }}
                    aria-hidden="true"
                  />
                  <span className="text-text-muted truncate">{alert.label}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <GlassCard className="overflow-hidden" hover={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <p className="text-sm font-semibold text-text">Live Activity Feed</p>
            <span className="flex items-center gap-1.5 text-xs text-accent-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" aria-hidden="true" />
              Streaming
            </span>
          </div>
          <LiveActivityFeed />
        </GlassCard>
      </motion.div>
    </Section>
  );
}
