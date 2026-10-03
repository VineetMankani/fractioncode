import data from "../data.json" with { type: "json" }
import type { SiteContent } from "./content"

export let siteData: SiteContent = data
export function setPreviewContent(content: SiteContent) { siteData = content }
export type Service = SiteContent["services"][number]
export type Project = SiteContent["projects"][number]
export type Section = keyof SiteContent["sections"]

export function visibleLink(link: { enabled: boolean; href: string; section?: string }) {
  return link.enabled && (!link.section || siteData.sections[link.section as Section])
}

export function externalUrl(url: string) {
  try {
    const parsed = new URL(url)
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : ""
  } catch {
    return ""
  }
}
