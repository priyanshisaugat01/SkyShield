import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { LuLayoutDashboard, LuFlag, LuClipboardCheck, LuBoxes, LuSettings, LuSearch } from "react-icons/lu";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";

const NAV_ITEMS = [
  { icon: LuLayoutDashboard, label: "Overview", active: true },
  { icon: LuFlag, label: "Findings", active: false },
  { icon: LuClipboardCheck, label: "Compliance", active: false },
  { icon: LuBoxes, label: "Assets", active: false },
  { icon: LuSettings, label: "Settings", active: false },
];

const STATS = [
  { label: "Open Findings", value: "42", delta: "-18% this week" },
  { label: "Compliance Score", value: "94%", delta: "+3.1% this week" },
  { label: "Assets Monitored", value: "8,204", delta: "+212 this week" },
];

const BARS = [38, 52, 44, 60, 48, 70, 55, 64, 58, 74, 66, 82];

const FINDINGS = [
  { severity: "Critical", color: "#f87171", title: "Public S3 bucket policy detected", resource: "prod-assets-bucket", time: "2m ago" },
  { severity: "High", color: "#fb923c", title: "IAM role with wildcard permissions", resource: "svc-billing-role", time: "14m ago" },
  { severity: "Medium", color: "#facc15", title: "Security group open on port 22", resource: "vpc-web-sg", time: "41m ago" },
  { severity: "Low", color: "#22d3ee", title: "Unused access key older than 90 days", resource: "iam-user-ci-bot", time: "1h ago" },
];

export default function PlatformPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rotateY.set(relX * 4);
    rotateX.set(-relY * 4);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Section id="preview" className="bg-bg-secondary/40">
      <SectionHeading
        eyebrow="Interactive Product Preview"
        title="Everything your security team needs, in one screen."
        description="A live control plane for cloud risk — no context switching between six different tools."
        align="center"
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 1400 }}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass rounded-2xl overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]"
      >
        {/* chrome bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="mx-auto text-xs text-text-muted">app.skyshield.io/dashboard</span>
        </div>

        <div className="grid grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[200px_minmax(0,1fr)]">
          {/* sidebar */}
          <div className="border-r border-white/10 p-3 sm:p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  item.active ? "bg-accent/15 text-text" : "text-text-muted"
                }`}
              >
                <item.icon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            ))}
          </div>

          {/* main content */}
          <div className="p-5 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-text">Overview</h3>
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text-muted">
                <LuSearch size={14} aria-hidden="true" />
                Search resources
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs text-text-muted">{stat.label}</p>
                  <p className="mt-1 text-lg sm:text-2xl font-semibold text-text">{stat.value}</p>
                  <p className="mt-1 text-[10px] sm:text-xs text-accent-2/80 hidden sm:block">{stat.delta}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-6">
              <p className="text-xs text-text-muted mb-4">Risk trend — last 12 weeks</p>
              <div className="flex items-end gap-1.5 sm:gap-2 h-24">
                {BARS.map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.04, ease: "easeOut" }}
                    className="flex-1 rounded-t-sm gradient-accent opacity-80"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
              {FINDINGS.map((finding) => (
                <div key={finding.title} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: finding.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 min-w-0 text-text truncate">{finding.title}</span>
                  <span className="hidden md:inline text-text-muted text-xs">{finding.resource}</span>
                  <span className="text-text-muted text-xs w-14 text-right shrink-0">{finding.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
