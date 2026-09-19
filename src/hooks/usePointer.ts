import { useEffect, useState } from "react"

/** Normalized pointer position, -0.5 to 0.5 on each axis, relative to viewport center. */
export function usePointer() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    function handleMove(e: PointerEvent) {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      setPos({ x, y })
    }

    window.addEventListener("pointermove", handleMove)
    return () => window.removeEventListener("pointermove", handleMove)
  }, [])

  return pos
}

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches)
  }, [])

  return isTouch
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return reduced
}
