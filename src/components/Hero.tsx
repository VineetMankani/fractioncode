import { siteData, visibleLink } from "../siteData"
import { ArrowUpRight } from "./icons"
import { useSceneMotion } from "../hooks/useSceneMotion"

export function Hero() {
  const { hero, brand } = siteData
  const scene = useSceneMotion<HTMLElement>()
  return (
    <section ref={scene} id="top" className="motion-scene hero-section relative flex min-h-[90svh] scroll-mt-28 items-center overflow-hidden px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
      {siteData.effects.enabled && <div className="hero-atmosphere" aria-hidden="true"><div className="scene-grid" /><div className="ambient-haze haze-one" /><div className="ambient-haze haze-two" /><div className="pointer-light" /></div>}
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="scene-reveal hero-copy">
          {hero.showBadge && <p className="mb-7 text-sm text-white/65">{hero.badge}</p>}
          {brand.enabled && hero.showName && <p className="brand-name mb-7 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{brand.name}</p>}
          {hero.showHeading && <h1 className="max-w-2xl font-heading text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{hero.heading}</h1>}
          {hero.showDescription && <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{hero.description}</p>}
          <div className="mt-9 flex flex-wrap gap-4">
            {hero.actions.filter(visibleLink).map((action, i) => <a key={action.href} href={action.href} className={`${i === 0 ? "brand-button" : "liquid-glass"} inline-flex min-h-12 items-center gap-3 rounded-full px-6 py-3 text-sm font-medium`}>{action.label}<ArrowUpRight className="h-4 w-4" /></a>)}
          </div>
        </div>
        {brand.enabled && hero.showLogo && <div className="brand-stage scene-reveal mx-auto w-full max-w-[360px] lg:max-w-none">
          {siteData.effects.enabled && <div className="orbit-track" aria-hidden="true"><span /></div>}
          <div className="brand-float"><div className="logo-panel brand-tilt"><div className="logo-shine" aria-hidden="true" /><img src={brand.logo} style={{ objectPosition: brand.logoPosition }} alt={brand.logoAlt} width="500" height="500" fetchPriority="high" className="relative h-auto w-full" /></div></div>
          {siteData.effects.enabled && hero.fragments.filter(item => item.enabled).map((item, i) => <div key={item.text} className={`floating-fragment fragment-${i % 2}`}><span className="fragment-dot" />{item.text}</div>)}
        </div>}
      </div>
    </section>
  )
}
