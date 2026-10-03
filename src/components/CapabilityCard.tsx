import { siteData, type Service } from "../siteData"
import { useSceneMotion } from "../hooks/useSceneMotion"

export function CapabilityCard(service: Service) {
  const scene = useSceneMotion<HTMLDivElement>()
  return (
    <div ref={scene} className="motion-scene h-full">
    <article className="capability-card scene-reveal liquid-glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6 md:p-8">
      {siteData.effects.enabled && <div className="card-light" aria-hidden="true" />}
      {service.showIndex && <span className="section-label mb-8 font-heading text-3xl">{service.index}</span>}
      {service.showVisual && <div className={`service-visual visual-${service.visual}`} aria-hidden="true"><span /><span /><span /><span /></div>}
      {service.showTitle && <h3 className="font-heading text-4xl">{service.title}</h3>}
      {service.showDescription && <p className="mt-4 text-sm leading-relaxed text-white/65">{service.copy}</p>}
      {service.showDeliverables && <div className="mt-7 border-t border-white/10 pt-5"><p className="text-xs text-white/50">{siteData.servicesContent.included}</p><ul className="mt-3 space-y-2 text-sm text-white/80">{service.deliverables.filter(item => item.enabled).map(item => <li key={item.text}>{item.text}</li>)}</ul></div>}
    </article>
    </div>
  )
}
