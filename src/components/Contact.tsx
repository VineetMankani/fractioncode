import { useState } from "react"
import { BlurText } from "./BlurText"
import { Reveal } from "./Reveal"
import { ArrowUpRight } from "./icons"

interface ContactProps {
  email: string
  whatsappNumber: string
  whatsappMessage: string
  heading: string
  description: string
  subject: string
  emailBody: string
}

export function Contact({ email, whatsappNumber, whatsappMessage, heading, description, subject, emailBody }: ContactProps) {
  const [copied, setCopied] = useState(false)
  const whatsapp = whatsappNumber.replace(/\D/g, "")
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}` : ""
  const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <section id="contact" className="scroll-mt-28 border-t border-white/10 bg-black px-6 py-24 md:px-10 md:py-32" aria-label="Contact SNYWEB">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="text-xs font-medium tracking-[0.25em] text-white/40">// GET IN TOUCH</span>
          </Reveal>
          <div className="mt-4 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-16">
            <div className="min-w-0">
              <BlurText
                as="h2"
                text={heading}
                className="max-w-3xl font-heading text-5xl italic leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl"
              />
              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55">
                {description}
              </p>
            </div>
            <div className="liquid-glass min-w-0 rounded-2xl p-6 sm:p-8">
              <p className="text-sm text-white/50">Open an email draft with a short project brief</p>
              <a
                href={emailUrl}
                data-cursor="open"
                className="mt-4 flex items-center justify-between gap-4 border-b border-white/15 pb-5 font-heading text-2xl italic text-white hover:text-white/70 sm:text-3xl"
              >
                <span className="min-w-0 break-all">{email}</span>
                <ArrowUpRight className="h-5 w-5 shrink-0" />
              </a>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={copyEmail} className="min-h-11 rounded-full border border-white/20 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white hover:text-black" aria-live="polite">
                  {copied ? "Email copied" : "Copy email"}
                </button>
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white hover:text-black">
                    Chat on WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-black px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-white/75">snyweb</span>
          <span>Websites people remember.</span>
          <a href="#top" className="flex min-h-11 w-fit items-center text-white/60 hover:text-white">Back to top ↑</a>
        </div>
      </footer>
    </>
  )
}
