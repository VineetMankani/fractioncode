import { motion } from "framer-motion"
import { usePointer } from "@/hooks/usePointer"

/**
 * Atmospheric layer of floating UI/typography/grid fragments used behind
 * the hero and capabilities sections. Purely decorative, aria-hidden.
 */
export function FloatingFragments({ variant = "hero" }: { variant?: "hero" | "capabilities" }) {
  const pointer = usePointer()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* grid lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* soft radial light */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-[60vh] w-[60vw] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* floating glass card fragment top-left */}
      <motion.div
        className="liquid-glass absolute left-[6%] top-[18%] hidden h-24 w-40 rounded-xl md:block"
        style={{ x: pointer.x * -20, y: pointer.y * -14 }}
        animate={{ y: ["-6px", "6px", "-6px"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="space-y-1.5 p-3">
          <div className="h-1.5 w-1/2 rounded-full bg-white/25" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
        </div>
      </motion.div>

      {/* typography fragment top-right */}
      <motion.div
        className="absolute right-[8%] top-[14%] hidden select-none font-heading text-6xl italic text-white/[0.05] md:block lg:text-7xl"
        style={{ x: pointer.x * 24, y: pointer.y * 16 }}
        animate={{ y: ["0px", "-10px", "0px"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        design
      </motion.div>

      {/* interface card fragment bottom-left */}
      <motion.div
        className="liquid-glass absolute bottom-[16%] left-[10%] hidden h-32 w-24 rounded-xl md:block"
        style={{ x: pointer.x * -16, y: pointer.y * 10 }}
        animate={{ y: ["4px", "-6px", "4px"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-full flex-col justify-between p-3">
          <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
          <div className="space-y-1">
            <div className="h-8 rounded-md bg-white/8" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
      </motion.div>

      {/* code fragment bottom-right */}
      <motion.div
        className="liquid-glass absolute bottom-[20%] right-[7%] hidden h-28 w-36 rounded-xl md:block"
        style={{ x: pointer.x * 18, y: pointer.y * -12 }}
        animate={{ y: ["-4px", "6px", "-4px"] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="space-y-1.5 p-3">
          <div className="h-1.5 w-1/3 rounded-full bg-white/25" />
          <div className="h-1.5 w-3/4 rounded-full bg-white/8" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/8" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/8" />
        </div>
      </motion.div>

      {variant === "capabilities" && (
        <motion.div
          className="absolute right-[4%] top-[40%] hidden select-none font-heading text-5xl italic text-white/[0.04] lg:block lg:text-6xl"
          animate={{ y: ["0px", "-8px", "0px"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          build
        </motion.div>
      )}
    </div>
  )
}
