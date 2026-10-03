import original from "../data.json"
import schema from "./contentSchema.json"

export type SiteContent = typeof original
export const contentTemplate: SiteContent = original

export function validateContent(input: unknown): asserts input is SiteContent {
  const walk = (value: any, rule: any, path: string) => {
    if (typeof rule === "string") {
      if (typeof value !== rule) throw new Error(`${path}: expected ${rule}`)
      if (rule === "string") {
        if (value.length > 20000 || /<\/?[a-z][^>]*>/i.test(value)) throw new Error(`${path}: use plain text (maximum 20,000 characters)`)
        const key = path.split(".").pop()!
        if (["href", "url", "linkedin"].includes(key) && value && !/^(https?:\/\/|mailto:|tel:|#[\w-]+$|\/(?!\/))/.test(value)) throw new Error(`${path}: unsafe link`)
        if (["image", "logo", "icon"].includes(key) && value && (!/^\/(?!\/)[\w/.-]+$/.test(value) || value.includes(".."))) throw new Error(`${path}: use a local image path`)
        if (/Position$/.test(key) && (!/^\d{1,3}% \d{1,3}%$/.test(value) || value.split(" ").some((part: string) => Number(part.slice(0, -1)) > 100))) throw new Error(`${path}: use percentage positioning from 0% to 100%`)
        if (["background", "foreground", "accent"].includes(key) && !/^#[\da-f]{6}$/i.test(value)) throw new Error(`${path}: use a six digit hex color`)
      }
    } else if (rule.array) {
      if (!Array.isArray(value) || value.length > 100) throw new Error(`${path}: expected a collection of up to 100 items`)
      value.forEach((item, index) => walk(item, rule.array, `${path}.${index}`))
    } else {
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path}: expected object`)
      if (Object.keys(value).some(key => !Object.prototype.hasOwnProperty.call(rule, key))) throw new Error(`${path}: unknown field`)
      Object.entries(rule).forEach(([key, child]) => walk(value[key], child, `${path}.${key}`))
    }
  }
  walk(input, schema, "content")
  const data = input as SiteContent
  const sections = ["hero", "services", "projects", "contact"]
  if (data.sectionOrder.length !== sections.length || sections.some(key => data.sectionOrder.filter(x => x === key).length !== 1)) throw new Error("sectionOrder must contain each page section once")
  data.projects.forEach(project => {
    if (!["live", "demo"].includes(project.kind) || (project.kind === "live" && !/^https?:\/\//.test(project.url))) throw new Error("Live projects require an HTTP(S) URL; kind must be live or demo")
  })
  if (new Set(data.projects.map(project => project.id)).size !== data.projects.length) throw new Error("Project IDs must be unique")
  if (new Set(data.services.map(service => service.index)).size !== data.services.length) throw new Error("Service indexes must be unique")
}
