import { motion } from "motion/react";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import { devSecOpsSteps } from "../../data/devSecOpsSteps";

export default function DevSecOpsWorkflow() {
  return (
    <Section id="pipeline" className="bg-bg-secondary/40">
      <SectionHeading
        eyebrow="DevSecOps Pipeline"
        title="Security as a checkpoint your pipeline already respects."
        description="No side-channel review process. Every stage below runs inside the CI/CD pipeline your engineers already use."
        align="center"
      />

      <div className="relative">
        <div
          className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          aria-hidden="true"
        />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4">
          {devSecOpsSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full liquid-glass flex items-center justify-center relative z-10">
                <step.icon size={20} className="text-accent-2" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-medium text-text">{step.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
