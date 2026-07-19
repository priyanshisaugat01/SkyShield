import { motion } from "motion/react";
import StatusBadge from "./StatusBadge";
import { topologyNodes, type TopologyNode } from "../../data/mock/awsTopology";

interface AwsTopologyProps {
  onSelectNode: (node: TopologyNode) => void;
}

export default function AwsTopology({ onSelectNode }: AwsTopologyProps) {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      {topologyNodes.map((node, index) => (
        <div key={node.id} className="flex flex-col items-center w-full">
          {index > 0 && (
            <div className="relative w-px h-8 bg-gradient-to-b from-white/10 via-accent-2/40 to-white/10 overflow-hidden">
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-2 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]"
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: index * 0.15 }}
              />
            </div>
          )}
          <motion.button
            type="button"
            onClick={() => onSelectNode(node)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
            className="group w-full flex items-center gap-3.5 rounded-xl liquid-glass border border-white/10 px-4 py-3 text-left transition-all hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(59,130,246,0.5)]"
          >
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <node.icon size={17} className="text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">{node.label}</p>
              <p className="text-xs text-text-muted truncate">{node.region}</p>
            </div>
            <StatusBadge status={node.health} />
          </motion.button>
        </div>
      ))}
    </div>
  );
}
