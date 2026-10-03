import { useEffect, useRef } from "react"
import { siteData } from "../siteData"

/** Local, frame-batched DOM updates: pointer movement never renders React. */
export function useSceneMotion<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || !siteData.effects.enabled) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    let inView = false
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let bounds: DOMRect | null = null
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      bounds = null
      node.style.setProperty("--pointer-x", "0")
      node.style.setProperty("--pointer-y", "0")
      node.dataset.pointer = "false"
    }
    const sync = () => {
      const active = inView && !document.hidden && !reduced.matches
      node.dataset.active = String(active)
      if (!active || !fine.matches) reset()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) node.dataset.revealed = "true"
      sync()
    }, { threshold: 0.08 })
    observer.observe(node)
    const move = (event: PointerEvent) => {
      if (!siteData.effects.pointer || reduced.matches || !fine.matches || !inView || document.hidden) return
      pointerX = event.clientX
      pointerY = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        bounds ??= node.getBoundingClientRect()
        const x = Math.max(-1, Math.min(1, (pointerX - bounds.left) / bounds.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (pointerY - bounds.top) / bounds.height * 2 - 1))
        node.style.setProperty("--pointer-x", x.toFixed(3))
        node.style.setProperty("--pointer-y", y.toFixed(3))
        node.dataset.pointer = "true"
      })
    }
    node.addEventListener("pointermove", move, { passive: true })
    node.addEventListener("pointerleave", reset)
    window.addEventListener("scroll", reset, { passive: true })
    window.addEventListener("resize", reset)
    document.addEventListener("visibilitychange", sync)
    reduced.addEventListener("change", sync)
    fine.addEventListener("change", sync)
    return () => {
      reset()
      observer.disconnect()
      node.removeEventListener("pointermove", move)
      node.removeEventListener("pointerleave", reset)
      window.removeEventListener("scroll", reset)
      window.removeEventListener("resize", reset)
      document.removeEventListener("visibilitychange", sync)
      reduced.removeEventListener("change", sync)
      fine.removeEventListener("change", sync)
    }
  }, [])
  return ref
}
