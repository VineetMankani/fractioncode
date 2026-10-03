import { useState } from "react"
import { siteData, externalUrl } from "../siteData"
import { ArrowUpRight } from "./icons"
import { SocialIcon } from "./SocialIcon"

export function Contact() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  const { studio, contact } = siteData
  const email = studio.email.trim()
  const emailUrl = `mailto:${email}?subject=${encodeURIComponent(contact.subject)}&body=${encodeURIComponent(contact.emailBody)}`
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(contact.subject)}&body=${encodeURIComponent(contact.emailBody)}`
  const whatsapp = studio.whatsappNumber.replace(/\D/g, "")
  const phone = studio.phoneNumber.replace(/[^+\d]/g, "")
  const socials = studio.socials.filter(link => link.enabled && externalUrl(link.url))

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <section id="contact" className="scroll-mt-28 border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        {contact.showLabel && <p className="section-label">{contact.label}</p>}
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-16">
          <div className="min-w-0">
            {contact.showHeading && <h2 className="max-w-3xl font-heading text-5xl leading-tight md:text-6xl">{contact.heading}</h2>}
            {contact.showDescription && <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">{contact.description}</p>}
          </div>
          <div className="liquid-glass min-w-0 rounded-2xl p-6 sm:p-8">
            {studio.showPlaceholderNotice && <p className="mb-5 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/65">{studio.placeholderNotice}</p>}
            {studio.showEmail && email && <>
              {contact.showEmailHint && <p className="text-sm text-white/65">{contact.emailHint}</p>}
              <a href={emailUrl} className="mt-4 flex items-center justify-between gap-4 border-b border-white/15 pb-5 text-xl font-medium hover:text-[var(--site-accent)]">
                <span className="min-w-0 break-all">{email}</span><ArrowUpRight className="h-5 w-5 shrink-0" />
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                {contact.showBrowserEmail && <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="brand-button rounded-full px-4 py-3 text-sm font-medium">{contact.browserEmail}</a>}
                {contact.showCopyEmail && <button type="button" onClick={copyEmail} className="contact-button">{status === "copied" ? contact.copiedEmail : contact.copyEmail}</button>}
              </div>
              {contact.showCopyEmail && <p role="status" className="mt-2 text-xs text-white/65">{status === "failed" ? contact.copyFailed : status === "copied" ? contact.copiedEmail : ""}</p>}
            </>}
            <div className="mt-5 flex flex-col gap-3">
              {studio.showPhone && phone && <a href={`tel:${phone}`} className="contact-button flex items-center gap-3"><SocialIcon platform="phone" /><span>{contact.phoneLabel}<span className="mt-1 block text-xs text-white/60">{studio.phoneNumber}</span></span></a>}
              {studio.showWhatsapp && whatsapp && <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(studio.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="contact-button flex items-center gap-3"><SocialIcon platform="whatsapp" /><span>{contact.whatsappLabel}<span className="mt-1 block text-xs text-white/60">{studio.whatsappNumber}</span></span></a>}
            </div>
            {contact.showSocials && socials.length > 0 && <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">{socials.map(link => <a key={link.platform} href={externalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="social-link inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm"><SocialIcon platform={link.platform} />{link.label}</a>)}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}

