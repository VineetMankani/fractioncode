import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, CloseIcon, MenuIcon } from "./icons"

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
]

export function Navbar({ showProjects }: { showProjects: boolean }) {
  const [open, setOpen] = useState(false)
  const links = showProjects ? [{ label: "Work", href: "#work" }, ...LINKS] : LINKS

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6 md:pt-6">
      <motion.div
        initial={{ opacity: 0, y: -16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="liquid-glass flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 md:px-3 md:py-2"
      >
        <a
          href="#top"
          className="flex min-h-11 items-center px-2 font-body text-base font-medium tracking-tight text-white md:px-3"
        >
          snyweb
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full md:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          data-cursor="open"
          className="liquid-glass-strong hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 md:flex"
        >
          Start a Project
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(10px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="liquid-glass-strong absolute left-4 right-4 top-[calc(100%+8px)] rounded-2xl p-4 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-base font-medium text-black"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
