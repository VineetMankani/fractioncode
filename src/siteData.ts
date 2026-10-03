import data from "../data.json"

export const siteData = data
export type Service = typeof data.services[number]
export type Project = typeof data.projects[number] & { image?: string; imageAlt?: string }
export type Section = keyof typeof data.sections

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
