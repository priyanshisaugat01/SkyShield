import { motion } from "motion/react";
import { LuCpu, LuMemoryStick, LuArrowRightLeft, LuTimer, LuActivity, LuWifi } from "react-icons/lu";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import LiveMetricCard from "../effects/LiveMetricCard";

const CLOUDWATCH_ALARMS = [
  { name: "cpu-utilization-alarm", status: "OK" },
  { name: "5xx-error-rate", status: "OK" },
  { name: "rds-connection-count", status: "OK" },
  { name: "disk-space-utilization", status: "ALARM" },
];

export default function LiveMonitoring() {
  return (
    <Section id="monitoring" className="bg-bg-secondary/40">
      <SectionHeading
        eyebrow="Live Monitoring"
        title="The same telemetry your on-call engineer sees at 3 a.m."
        description="Metrics tick in real time below — this is a live view, not a static screenshot."
        align="center"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <LiveMetricCard icon={LuCpu} label="CPU Utilization" unit="%" base={45} jitter={10} />
        <LiveMetricCard icon={LuMemoryStick} label="Memory Usage" unit="%" base={62} jitter={7} />
        <LiveMetricCard icon={LuArrowRightLeft} label="Requests / sec" unit="req/s" base={1200} jitter={280} />
        <LiveMetricCard icon={LuTimer} label="P99 Latency" unit="ms" base={145} jitter={35} />
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlassCard className="p-6 sm:p-7 h-full" hover={false}>
            <div className="flex items-center gap-2.5 mb-5">
              <LuWifi size={16} className="text-accent-2" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
                Network Traffic
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <LiveMetricCard icon={LuArrowRightLeft} label="Inbound" unit="MB/s" base={84} jitter={22} decimals={1} />
              <LiveMetricCard icon={LuArrowRightLeft} label="Outbound" unit="MB/s" base={51} jitter={16} decimals={1} />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <GlassCard className="p-6 sm:p-7 h-full" hover={false}>
            <div className="flex items-center gap-2.5 mb-5">
              <LuActivity size={16} className="text-accent-2" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
                CloudWatch Alarms
              </p>
            </div>
            <ul className="space-y-3">
              {CLOUDWATCH_ALARMS.map((alarm) => (
                <li key={alarm.name} className="flex items-center justify-between text-sm">
                  <span className="text-text-muted truncate pr-3">{alarm.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      alarm.status === "OK"
                        ? "bg-accent-2/15 text-accent-2"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {alarm.status}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  );
}
