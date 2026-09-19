import { BlurText } from "./BlurText"
import { Reveal } from "./Reveal"
import { ArrowUpRight } from "./icons"
import type { Project } from "../siteData"

interface ProjectsProps {
  projects: Project[]
  email: string
}

function ProjectPreview({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt || `${project.title} website preview`}
        loading="lazy"
        className="h-full w-full object-cover object-top"
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
        <span className="opacity-60">MENU</span>
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
  const hasLiveProject = projects.some((project) => project.kind === "live")

  return (
    <section id="work" className="scroll-mt-28 border-t border-white/10 bg-black px-6 py-24 md:px-10 md:py-32" aria-label="Website projects">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-medium tracking-[0.25em] text-white/40">// WEBSITES</span>
        </Reveal>
        <BlurText
          as="h2"
          text={hasLiveProject ? "Selected websites." : "Website concepts."}
          className="mt-4 max-w-3xl font-heading text-5xl italic leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl"
        />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
          {hasLiveProject
            ? "A selection of live sites and concept previews. Each card shows the work and a few of its useful features."
            : "Sample concepts for different businesses. These are examples of page direction and useful features, not delivered client projects."}
        </p>

        {projects.length > 0 ? (
          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="liquid-glass flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden border-b border-white/10">
                  <ProjectPreview project={project} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                    <span>{project.category}</span>
                    {project.kind === "demo" && <span className="rounded-full border border-white/15 px-2 py-0.5 text-white/65">Demo concept</span>}
                  </div>
                  <h3 className="mt-3 font-heading text-3xl italic text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{project.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${project.title} features`}>
                    {project.features.map((feature) => (
                      <li key={feature} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/65">{feature}</li>
                    ))}
                  </ul>
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" data-cursor="open" className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-sm font-medium text-white hover:text-white/65">
                      View live site <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="mt-auto pt-7 text-sm text-white/35">Concept preview</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="liquid-glass mt-12 rounded-2xl p-8 sm:p-10 md:mt-16">
            <p className="font-heading text-3xl italic text-white">No projects listed yet.</p>
            <a href={`mailto:${email}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-white/70 hover:text-white">Ask about our work <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        )}
      </div>
    </section>
  )
}
