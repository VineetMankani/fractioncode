import { siteData, type Service } from "../siteData"
import { CapabilityCard } from "./CapabilityCard"

export function Capabilities({ services }: { services: Service[] }) {
  const content = siteData.servicesContent
  return (
    <section id="services" className="scroll-mt-28 border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        {content.showLabel && <p className="section-label">{content.label}</p>}
        {content.showHeading && <h2 className="mt-4 max-w-2xl font-heading text-5xl leading-tight md:text-6xl">{content.heading}</h2>}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(service => <CapabilityCard key={service.index} {...service} />)}</div>
      </div>
    </section>
  )
}
