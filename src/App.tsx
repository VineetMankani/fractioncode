import { Capabilities } from "./components/Capabilities"
import { Contact } from "./components/Contact"
import { Hero } from "./components/Hero"
import { Navbar } from "./components/Navbar"
import { Projects } from "./components/Projects"
import { externalUrl, siteData } from "./siteData"
import type { CSSProperties } from "react"

export default function App() {
  const { sections, theme, footer, brand } = siteData
  const firstSection = sections.hero ? "#top" : sections.services ? "#services" : sections.projects ? "#work" : sections.contact ? "#contact" : "#main"
  return (
    <div className="site-shell relative min-h-screen font-body" data-effects={siteData.effects.enabled} data-ambient={siteData.effects.ambient} data-reveals={siteData.effects.reveals} style={{ "--site-bg": theme.background, "--site-accent": theme.accent, "--site-fg": theme.foreground } as CSSProperties}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black">{siteData.accessibility.skip}</a>
      {sections.navbar && <Navbar home={firstSection} />}
      <main id="main">
        {sections.hero && <Hero />}
        {sections.services && <Capabilities services={siteData.services.filter(item => item.enabled)} />}
        {sections.projects && <Projects projects={siteData.projects.filter(item => item.enabled)} email={siteData.studio.showEmail ? siteData.studio.email : ""} />}
        {sections.contact && <Contact />}
      </main>
      {sections.footer && <footer className="border-t border-white/10 px-6 py-8 md:px-10">
        <div className="mx-auto max-w-6xl text-sm text-white/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {brand.enabled && <span className="flex items-center gap-3 text-xl font-semibold text-white"><img src={brand.icon} alt="" width="40" height="40" />{brand.name}</span>}
            {footer.showTagline && <span>{footer.tagline}</span>}
            {footer.showBackToTop && <a href={firstSection} className="min-h-11 content-center transition-colors hover:text-[var(--site-accent)]">{footer.backToTop}</a>}
          </div>
          {(footer.showCopyright || footer.showFounders) && <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            {footer.showCopyright && <small className="text-xs">{footer.copyright}</small>}
            {footer.showFounders && <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{footer.foundersLabel}</span>
              {footer.founders.filter(founder => founder.enabled).map((founder, index) => <span key={founder.name}>
                {index > 0 && <span aria-hidden="true"> &amp; </span>}
                {externalUrl(founder.linkedin) ? <a href={externalUrl(founder.linkedin)} target="_blank" rel="noopener noreferrer" aria-label={`${founder.name} ${footer.profileLabel}`} className="footer-founder-link text-white/75">{founder.name}</a> : <span className="text-white/75">{founder.name}</span>}
              </span>)}
            </p>}
          </div>}
        </div>
      </footer>}
    </div>
  )
}
