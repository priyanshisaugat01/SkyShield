import { motion } from "motion/react";
import { LuScan, LuFileCheck, LuBadgeCheck } from "react-icons/lu";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import { complianceFrameworks } from "../../data/complianceFrameworks";

const EVIDENCE_STEPS = [
  { icon: LuScan, label: "Continuous scanning" },
  { icon: LuFileCheck, label: "Mapped to controls" },
  { icon: LuBadgeCheck, label: "Audit-ready evidence" },
];

function scoreColor(score: number) {
  if (score >= 95) return "#22d3ee";
  if (score >= 90) return "#3b82f6";
  return "#facc15";
}

export default function ComplianceAutomation() {
  return (
    <Section id="compliance" className="bg-bg-secondary/40">
      <SectionHeading
        eyebrow="Compliance Automation"
        title="Evidence collected continuously, not gathered the week before an audit."
        description="SkyShield maps every scan result directly to the controls your auditors already ask about — the report below is generated live, not assembled by hand."
        align="center"
      />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <GlassCard className="p-8 h-full" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 mb-6">
              Framework Coverage
            </p>
            <div className="space-y-5">
              {complianceFrameworks.map((framework, index) => (
                <div key={framework.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text">{framework.name}</span>
                    <span className="text-sm font-semibold text-text">{framework.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: scoreColor(framework.score) }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${framework.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.08, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <GlassCard className="p-8 h-full" hover={false}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 mb-6">
              Evidence Pipeline
            </p>
            <div className="space-y-6">
              {EVIDENCE_STEPS.map((step, index) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <step.icon size={17} className="text-accent-2" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-text">{step.label}</p>
                  {index < EVIDENCE_STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-white/10 ml-2" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">Overall compliance posture</span>
                <span className="text-2xl font-semibold text-gradient-accent">94%</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Last evidence snapshot generated automatically after the most recent scan — no
                manual export required before your next audit.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  );
}
