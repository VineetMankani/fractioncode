import { motion } from "framer-motion"
import type { ElementType } from "react"

interface BlurTextProps {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
}

/**
 * Animates text word-by-word with a blur/fade/rise reveal.
 * Wraps each word in an inline-block span so the blur transition stays crisp.
 */
export function BlurText({
  text,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0.09,
  once = true,
}: BlurTextProps) {
  const words = text.split(" ")

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-visible">
            <motion.span
              className="inline-block will-change-[filter,transform,opacity]"
              initial={{ filter: "blur(12px)", opacity: 0, y: 50 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once, margin: "-10%" }}
              transition={{
                duration: 0.7,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>
    </Tag>
  )
}
