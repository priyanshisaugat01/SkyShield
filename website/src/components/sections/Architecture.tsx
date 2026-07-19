import { motion } from "motion/react";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { architectureNodes, architectureEdges, type ArchNode } from "../../data/architectureNodes";

const NODE_STYLES: Record<ArchNode["kind"], string> = {
  edge: "border-accent-2/40",
  compute: "border-accent/40",
  data: "border-accent-2/40",
  governance: "border-white/20",
};

function nodeById(id: string) {
  return architectureNodes.find((n) => n.id === id)!;
}

export default function Architecture() {
  return (
    <Section id="architecture" className="bg-bg-secondary/40">
      <SectionHeading
        eyebrow="Cloud Architecture Visualization"
        title="See exactly how a request moves through your stack."
        description="A live map of the AWS services SkyShield already understands — request flow in blue, governance and observability layered underneath."
        align="center"
      />

      {/* Desktop: positioned diagram with animated glowing connectors */}
      <div className="hidden lg:block relative w-full aspect-[16/8] rounded-2xl border border-white/10 bg-bg/40 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="arch-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {architectureEdges.map((edge, index) => {
            const from = nodeById(edge.from);
            const to = nodeById(edge.to);
            const isFlow = edge.variant === "flow";
            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isFlow ? "#22D3EE" : "#ffffff"}
                strokeOpacity={isFlow ? 0.55 : 0.22}
                strokeWidth={isFlow ? 0.35 : 0.25}
                strokeDasharray={isFlow ? "2 1.5" : "0.5 1.5"}
                filter={isFlow ? "url(#arch-glow)" : undefined}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: isFlow ? -14 : 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: index * 0.1 }}
              />
            );
          })}
        </svg>

        {architectureNodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className={`w-12 h-12 rounded-xl liquid-glass border ${NODE_STYLES[node.kind]} flex items-center justify-center`}
            >
              <node.icon size={19} className="text-text" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">{node.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Mobile / tablet: simple stacked list, no coordinate-dependent SVG */}
      <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4">
        {architectureNodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className={`liquid-glass rounded-xl border ${NODE_STYLES[node.kind]} flex flex-col items-center gap-2 p-4`}
          >
            <node.icon size={20} className="text-text" aria-hidden="true" />
            <span className="text-xs font-medium text-text-muted text-center">{node.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
        <span className="flex items-center gap-2">
          <span className="w-4 h-0.5 rounded-full bg-accent-2" aria-hidden="true" />
          Request flow
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-0.5 rounded-full bg-white/30" aria-hidden="true" />
          Governance &amp; observability
        </span>
      </div>
    </Section>
  );
}
