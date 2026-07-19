import { motion } from "motion/react";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import TiltCard from "../effects/TiltCard";
import { securityLayers } from "../../data/securityLayers";

export default function SecurityFeatures() {
  return (
    <Section id="security">
      <SectionHeading
        eyebrow="Infrastructure Security"
        title="Defense in depth, from source to runtime."
        description="Hover a layer to see what SkyShield actually found the last time it ran — not a hypothetical."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {securityLayers.map((layer, index) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: "easeOut" }}
          >
            <TiltCard>
              <GlassCard className="group p-6 h-full overflow-hidden">
                <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-90">
                  <layer.icon size={20} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-text">{layer.title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{layer.description}</p>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-text-muted transition-colors duration-300 group-hover:text-text">
                    {layer.scanResult}
                  </span>
                  <span className="text-xs font-medium text-text-muted/70 transition-colors duration-300 group-hover:text-accent-2">
                    {layer.scanDetail}
                  </span>
                </div>
              </GlassCard>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
