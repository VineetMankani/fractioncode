import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"
import { usePointer } from "@/hooks/usePointer"

interface BrowserMockupProps {
  className?: string
  depth?: number
  variant?: "primary" | "ghost"
}

/**
 * The signature floating browser-window visual. Tilts gently with the
 * cursor and contains a small self-contained "website" composition so
 * visitors immediately read it as a real site preview.
 */
export function BrowserMockup({
  className,
  depth = 1,
  variant = "primary",
}: BrowserMockupProps) {
  const pointer = usePointer()

  const rotateX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })

  useEffect(() => {
    rotateX.set(-pointer.y * 10 * depth)
    rotateY.set(pointer.x * 14 * depth)
  }, [pointer, depth, rotateX, rotateY])

  const translateX = useTransform(rotateY, (v) => v * 0.6)
  const translateY = useTransform(rotateX, (v) => -v * 0.6)

  if (variant === "ghost") {
    return (
      <div
        className={className}
        style={{ perspective: 1400 }}
        aria-hidden="true"
      >
        <motion.div
          style={{ rotateX, rotateY }}
          className="liquid-glass h-full w-full rounded-2xl opacity-40"
        >
          <div className="flex h-8 items-center gap-1.5 border-b border-white/5 px-4">
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          </div>
          <div className="space-y-2 p-4">
            <div className="h-2 w-2/3 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/5" />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ perspective: 1600 }}
      role="img"
      aria-label="Preview of a premium website interface built by SNYWEB"
    >
      <motion.div
        style={{ rotateX, rotateY, x: translateX, y: translateY }}
        className="liquid-glass-strong relative w-full overflow-hidden rounded-2xl md:rounded-3xl"
      >
        {/* browser chrome */}
        <div className="flex h-9 items-center gap-4 border-b border-white/10 px-4 md:h-11 md:px-5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <div className="flex-1">
            <div className="mx-auto flex h-5 w-2/3 max-w-[240px] items-center justify-center rounded-full bg-white/5 text-[9px] tracking-wide text-white/40 md:w-1/2">
              snyweb.studio
            </div>
          </div>
        </div>

        {/* website content preview, gently auto-scrolling */}
        <div className="no-scrollbar relative h-[220px] overflow-hidden md:h-[320px] lg:h-[380px]">
          <motion.div
            className="absolute inset-x-0 top-0 space-y-4 p-5 md:p-8"
            animate={{ y: [0, -60, 0] }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
          >
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-16 rounded-full bg-white/25" />
              <div className="flex gap-3">
                <div className="h-2 w-8 rounded-full bg-white/10" />
                <div className="h-2 w-8 rounded-full bg-white/10" />
                <div className="h-2 w-8 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="h-4 w-4/5 rounded bg-white/30 md:h-6" />
              <div className="h-4 w-3/5 rounded bg-white/15 md:h-6" />
            </div>

            <div className="flex gap-2 pt-2">
              <div className="h-7 w-20 rounded-full bg-white/80" />
              <div className="h-7 w-20 rounded-full border border-white/15" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-6">
              <div className="aspect-[4/3] rounded-lg bg-white/8" />
              <div className="aspect-[4/3] rounded-lg bg-white/12" />
              <div className="aspect-[4/3] rounded-lg bg-white/6" />
            </div>

            <div className="space-y-2 pt-6">
              <div className="h-2 w-full rounded-full bg-white/8" />
              <div className="h-2 w-5/6 rounded-full bg-white/8" />
              <div className="h-2 w-2/3 rounded-full bg-white/8" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="aspect-video rounded-lg bg-white/10" />
              <div className="aspect-video rounded-lg bg-white/6" />
            </div>
          </motion.div>

          {/* soft light sweep */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.06) 45%, transparent 60%)",
            }}
            animate={{ x: ["-40%", "40%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  )
}
