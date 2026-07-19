import { motion } from "motion/react";
import Button from "../ui/Button";
import MagneticButton from "../effects/MagneticButton";
import FadeIn from "../effects/FadeIn";
import AnimatedHeading from "../effects/AnimatedHeading";
import { heroHighlights } from "../../data/heroHighlights";

export default function Hero() {
  return (
    <section id="home" className="relative px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4">
      <div className="relative w-full h-[94vh] min-h-[640px] max-h-[960px] rounded-[2rem] overflow-hidden">
        <img
          src="/images/hero-aviation.jpg"
          alt="Aircraft flying above a blanket of clouds"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />

        {/* Legibility scrim — darkens where copy sits without flattening the
            photo into a dimmed box, per the "no cheap overlay" brief. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-bg/50"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* The page-level floating Navbar sits fixed above this card, so no
            second nav is duplicated in here. */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: "easeOut" }}
          className="hidden md:block absolute top-28 right-6 lg:right-10 w-[300px] lg:w-[340px]"
        >
          <div className="liquid-glass rounded-2xl px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 mb-4">
              Platform Capabilities
            </p>
            <ul className="space-y-3">
              {heroHighlights.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-text/90">
                  <item.icon size={15} className="text-accent-2 shrink-0" aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 lg:px-14 pb-10 sm:pb-14 lg:pb-16">
          <FadeIn delay={200} duration={700}>
            <p className="text-sm sm:text-base text-text-muted mb-4">Welcome to SkyShield</p>
          </FadeIn>

          <AnimatedHeading
            text={"Enterprise Aviation\nCloud Security."}
            className="font-sans font-normal leading-[1.05] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-text mb-5 max-w-3xl"
            initialDelay={400}
            charDelay={18}
          />

          <FadeIn delay={1000} duration={900}>
            <p className="text-base sm:text-lg text-text-muted max-w-xl mb-8">
              SkyShield protects aviation cloud infrastructure through AI-powered
              monitoring, DevSecOps automation, compliance validation,
              infrastructure security, container protection, and intelligent
              threat detection across AWS environments.
            </p>
          </FadeIn>

          <FadeIn delay={1300} duration={900}>
            <div className="flex flex-wrap gap-4">
              <MagneticButton>
                <Button href="/login" variant="primary">
                  Launch Platform
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button href="#preview" variant="secondary">
                  Explore Platform
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
