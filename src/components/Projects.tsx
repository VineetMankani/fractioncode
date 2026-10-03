import { ArrowUpRight } from "./icons"
import { siteData, externalUrl, type Project } from "../siteData"

interface ProjectsProps {
  projects: Project[]
  email: string
}

function ProjectPreview({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt || `${project.title} ${siteData.projectsContent.imageAltSuffix}`}
        loading="lazy"
        className="h-full w-full object-cover object-top"
        style={{ objectPosition: project.imagePosition }}
      />
    )
  }

  const preview = project.preview
  if (!preview) {
    return (
      <div className="flex h-full items-end bg-white/[0.04] p-6" aria-hidden="true">
        <span className="font-heading text-4xl italic leading-none text-white/70">{project.title}</span>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full flex-col overflow-hidden p-4 sm:p-6"
      style={{ backgroundColor: preview.background, color: preview.foreground }}
    >
      <div className="absolute -bottom-20 -right-16 h-60 w-60 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: preview.accent }} />
      <div className="relative flex items-center justify-between gap-4 border-b pb-3 text-[9px] font-semibold tracking-[0.12em] sm:text-[10px]" style={{ borderColor: `${preview.foreground}33` }}>
        <span>{preview.brand}</span>
        <span className="opacity-60">{siteData.projectsContent.menu}</span>
      </div>
      <div className="relative flex flex-1 flex-col items-start justify-center py-5">
        <p className="max-w-[85%] font-heading text-3xl italic leading-[0.95] sm:text-5xl lg:text-4xl xl:text-5xl">{preview.headline}</p>
        <span className="mt-3 rounded-full px-4 py-2 text-[10px] font-semibold sm:mt-5" style={{ backgroundColor: preview.accent, color: preview.background }}>
          {preview.action}
        </span>
      </div>
      <div className="relative flex gap-2 border-t pt-3" style={{ borderColor: `${preview.foreground}33` }}>
        <span className="h-1 w-1/3 rounded-full opacity-35" style={{ backgroundColor: preview.foreground }} />
        <span className="h-1 w-1/5 rounded-full opacity-20" style={{ backgroundColor: preview.foreground }} />
      </div>
    </div>
  )
}

export function Projects({ projects, email }: ProjectsProps) {
  const content = siteData.projectsContent
  const hasLiveProject = projects.some((project) => project.kind === "live")

  return (
    <section id="work" className="scroll-mt-28 border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        {content.showLabel && <p className="section-label">{content.label}</p>}
        {content.showHeading && <h2 className="mt-4 max-w-3xl font-heading text-5xl leading-tight md:text-6xl">{hasLiveProject ? content.heading : content.demoHeading}</h2>}
        {content.showDescription && <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">{hasLiveProject ? content.description : content.demoDescription}</p>}

        {projects.length > 0 ? (
          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="liquid-glass flex h-full flex-col overflow-hidden rounded-2xl">
                {project.showPreview && <div className="aspect-[4/3] overflow-hidden border-b border-white/10">
                  <ProjectPreview project={project} />
                </div>}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                    {project.showCategory && <span>{project.category}</span>}
                    {project.showKind && project.kind === "demo" && <span className="rounded-full border border-white/15 px-2 py-0.5 text-white/65">{content.demo}</span>}
                  </div>
                  {project.showTitle && <h3 className="mt-3 font-heading text-3xl italic text-white">{project.title}</h3>}
                  {project.showDescription && <p className="mt-3 text-sm leading-relaxed text-white/55">{project.description}</p>}
                  {project.showFeatures && <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${project.title} ${content.featuresLabel}`}>
                    {project.features.filter(feature => feature.enabled).map((feature) => (
                      <li key={feature.text} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/65">{feature.text}</li>
                    ))}
                  </ul>}
                  {project.showLink && (project.kind === "live" && externalUrl(project.url) ? (
                    <a href={externalUrl(project.url)} target="_blank" rel="noopener noreferrer" data-cursor="open" className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-sm font-medium text-white hover:text-white/65">
                      {content.liveLink} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="mt-auto pt-7 text-sm text-white/35">{content.preview}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="liquid-glass mt-12 rounded-2xl p-8 sm:p-10 md:mt-16">
            <p className="font-heading text-3xl italic text-white">{content.empty}</p>
            {email && <a href={`mailto:${email}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-white/70 hover:text-white">{content.enquiry} <ArrowUpRight className="h-4 w-4" /></a>}
          </div>
        )}
      </div>
    </section>
  )
}
