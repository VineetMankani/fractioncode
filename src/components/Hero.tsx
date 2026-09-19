import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { BlurText } from "./BlurText"
import { BrowserMockup } from "./BrowserMockup"
import { FloatingFragments } from "./FloatingFragments"
import { Marquee } from "./Marquee"
import { Reveal } from "./Reveal"
import { ArrowDown, ArrowUpRight } from "./icons"

export function Hero({ description }: { description: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const mockupBlur = useTransform(scrollYProgress, [0, 1], [0, 10])
  const mockupOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fragmentsSpread = useTransform(scrollYProgress, [0, 1], [1, 1.4])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black"
      aria-label="Hero"
    >
      <motion.div style={{ scale: fragmentsSpread }} className="absolute inset-0">
        <FloatingFragments variant="hero" />
      </motion.div>

      {/* signature browser mockup, floating below/behind the copy */}
      <motion.div
        style={{
          scale: mockupScale,
          filter: useTransform(mockupBlur, (b) => `blur(${b}px)`),
          opacity: mockupOpacity,
        }}
        className="absolute inset-x-0 bottom-0 top-[38%] flex items-end justify-center px-4 md:top-[30%]"
      >
        <BrowserMockup className="w-full max-w-3xl" depth={1} />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-6 pt-28 text-center md:pt-32"
      >
        <Reveal>
          <span className="liquid-glass inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/70 md:text-sm">
            Independent web design &amp; development studio
          </span>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-7 font-heading text-2xl font-medium uppercase tracking-[0.3em] text-white/90 md:text-3xl md:tracking-[0.4em]">
            SnyWeb
          </p>
        </Reveal>

        <BlurText
          as="h1"
          text="Websites people remember."
          className="mt-4 max-w-4xl font-heading text-6xl italic leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7rem] xl:text-[8rem]"
          delay={0.25}
        />

        <Reveal delay={0.5} className="mt-6 max-w-[650px]">
          <p className="text-balance text-base leading-relaxed text-white/60 md:text-lg">
            {description}
          </p>
        </Reveal>

        <Reveal delay={0.65} className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#contact"
            data-cursor="open"
            className="liquid-glass-strong group flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 md:text-base"
          >
            Start a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#services"
            data-cursor="view"
            className="group flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white md:text-base"
          >
            See What We Do
            <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </Reveal>
      </motion.div>

      <div className="relative z-10 mt-auto">
        <Marquee />
      </div>
    </section>
  )
}
