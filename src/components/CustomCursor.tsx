import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useIsTouchDevice, usePrefersReducedMotion } from "@/hooks/usePointer"

/**
 * Tasteful desktop-only custom cursor. Expands over elements marked with
 * data-cursor="view" or data-cursor="open" and shows a matching label.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice()
  const reducedMotion = usePrefersReducedMotion()
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (isTouch || reducedMotion) return

    document.body.classList.add("cursor-none")
    return () => document.body.classList.remove("cursor-none")
  }, [isTouch, reducedMotion])

  useEffect(() => {
    if (isTouch || reducedMotion) return

    function handleMove(e: PointerEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)

      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]",
      )
      setLabel(target?.dataset.cursor === "open" ? "OPEN" : target ? "VIEW" : null)
    }

    function handleLeave() {
      setVisible(false)
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerleave", handleLeave)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerleave", handleLeave)
    }
  }, [isTouch, reducedMotion, x, y])

  if (isTouch || reducedMotion) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[70] flex items-center justify-center rounded-full border border-white/25 bg-white/5 text-[10px] font-medium tracking-[0.15em] text-white backdrop-blur-sm"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 64 : 16,
        height: label ? 64 : 16,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {label && (
        <span className="flex items-center gap-0.5">
          {label}
          {label === "OPEN" && <span aria-hidden="true">↗</span>}
        </span>
      )}
    </motion.div>
  )
}
