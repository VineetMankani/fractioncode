import { useRef, type ReactNode } from "react"
import { motion, useMotionValue } from "framer-motion"
import { ArrowUpRight } from "./icons"
import { Reveal } from "./Reveal"

interface CapabilityCardProps {
  index: string
  title: string
  copy: string
  deliverables: string[]
  visual: ReactNode
  delay?: number
  className?: string
}

export function CapabilityCard({ index, title, copy, deliverables, visual, delay = 0, className = "" }: CapabilityCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    glowX.set(((e.clientX - rect.left) / rect.width) * 100)
    glowY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="liquid-glass group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 md:p-7"
        data-cursor="view"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(220px circle at ${glowX.get()}% ${glowY.get()}%, rgba(255,255,255,0.10), transparent 70%)`,
          }}
        />

        <div className="mb-6 flex items-center justify-between">
          <span className="font-heading text-2xl italic text-white/40">{index}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-white/30 group-hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="relative mb-6 h-36 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
          {visual}
        </div>

        <h3 className="font-heading text-3xl italic tracking-tight text-white">{title}</h3>

        <p className="mt-3 text-sm leading-relaxed text-white/60">{copy}</p>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs text-white/40">Included in this stage</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {deliverables.map((item) => (
              <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-white/30">—</span>{item}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Reveal>
  )
}
