import { motion } from "framer-motion"
import { BlurText } from "./BlurText"
import { CapabilityCard } from "./CapabilityCard"
import { FloatingFragments } from "./FloatingFragments"
import { Reveal } from "./Reveal"
import { ArrowUpRight } from "./icons"
import type { Service } from "../siteData"

function DesignVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-3 p-4">
      <div className="flex-1 space-y-1.5 rounded-md border border-dashed border-white/15 p-2.5">
        <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
        <div className="mt-2 h-8 rounded border border-dashed border-white/10" />
      </div>
      <motion.div
        className="text-white/30"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowUpRight className="h-4 w-4 rotate-90" />
      </motion.div>
      <div className="flex-1 space-y-1.5 rounded-md bg-white/[0.06] p-2.5">
        <div className="h-1.5 w-2/3 rounded-full bg-white/40" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
        <div className="mt-2 h-8 rounded bg-white/10" />
      </div>
    </div>
  )
}

function BuildVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-3 p-4">
      <div className="flex-1 space-y-1 font-mono text-[9px] leading-relaxed text-white/25">
        <div>&lt;div class=&quot;hero&quot;&gt;</div>
        <div className="pl-2">&lt;h1 /&gt;</div>
        <div className="pl-2">&lt;Button /&gt;</div>
        <div>&lt;/div&gt;</div>
      </div>
      <motion.div
        className="h-8 w-px bg-white/10"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="flex-1 space-y-1.5 rounded-md bg-white/[0.06] p-2.5">
        <div className="h-1.5 w-1/2 rounded-full bg-white/40" />
        <div className="h-6 rounded bg-white/15" />
      </div>
    </div>
  )
}

function ExperienceVisual() {
  return (
    <div className="relative flex h-full items-center justify-center p-4">
      <motion.span
        className="font-heading text-2xl italic text-white/60"
        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        motion
      </motion.span>
      <motion.div
        className="absolute h-8 w-8 rounded-full border border-white/20"
        animate={{
          x: [-40, 30, -10, -40],
          y: [10, -12, 8, 10],
          opacity: [0.6, 0.9, 0.6, 0.6],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

const visuals = [<DesignVisual />, <BuildVisual />, <ExperienceVisual />]

export function Capabilities({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      className="relative min-h-[100svh] scroll-mt-28 overflow-hidden bg-black px-6 py-24 md:px-10 md:py-32"
      aria-label="Capabilities"
    >
      <FloatingFragments variant="capabilities" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-medium tracking-[0.25em] text-white/40">
            // WHAT WE DO
          </span>
        </Reveal>

        <BlurText
          as="h2"
          text="From idea to internet."
          className="mt-4 max-w-2xl font-heading text-5xl italic leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {services.map((service, i) => (
            <CapabilityCard
              key={service.index}
              {...service}
              visual={visuals[i] ?? <DesignVisual />}
              delay={i * 0.12}
              className={services.length % 2 === 1 && i === services.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
