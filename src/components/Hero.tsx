import { siteData, visibleLink } from "../siteData"
import { ArrowDown, ArrowUpRight } from "./icons"
import { useSceneMotion } from "../hooks/useSceneMotion"
import { HeroBackdrop } from "./HeroBackdrop"

export function Hero() {
  const { hero, brand } = siteData
  const scene = useSceneMotion<HTMLElement>()
  return (
    <section ref={scene} id="top" className="motion-scene hero-section relative isolate scroll-mt-28 overflow-hidden px-6 md:px-10">
      {siteData.effects.enabled && <div className="hero-atmosphere" aria-hidden="true"><div className="scene-grid" /></div>}
      <div className="scene-reveal hero-copy relative z-10 mx-auto flex w-full flex-col items-center text-center">
        {hero.showBadge && <p className="hero-badge">{hero.badge}</p>}
        {brand.enabled && hero.showLogo && <div className="hero-logo">
          <img src={brand.logo} alt={brand.logoAlt} style={{ objectPosition: brand.logoPosition }} width="1254" height="1254" fetchPriority="high" />
        </div>}
        {brand.enabled && hero.showName && !hero.showLogo && <p className="hero-brand-name">{brand.name}</p>}
        {hero.showHeading && <h1 className="hero-heading font-heading">{hero.heading}</h1>}
        {hero.showDescription && <p className="hero-description">{hero.description}</p>}
        <div className="hero-actions flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {hero.actions.filter(visibleLink).map((action, i) => <a key={action.href} href={action.href} className={`${i === 0 ? "brand-button" : "hero-secondary"} inline-flex min-h-12 items-center gap-3 rounded-full px-6 py-3 text-sm font-medium`}>{action.label}{i === 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}</a>)}
        </div>
      </div>
      {siteData.effects.enabled && <HeroBackdrop />}
      {hero.marquee.enabled && <div className="hero-marquee">
        <div className="hero-marquee-track">
          {[0, 1, 2, 3].map(copy => <div key={copy} className="hero-marquee-group" aria-hidden={copy > 0 ? true : undefined}>
            {hero.marquee.words.map(word => <span key={word}>{word}<i aria-hidden="true">·</i></span>)}
          </div>)}
        </div>
      </div>}
    </section>
  )
}
