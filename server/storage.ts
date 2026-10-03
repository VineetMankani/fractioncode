import type { SiteContent } from "../src/content"

export interface Snapshot { content: SiteContent; revision: string }
export interface Media { path: string; size: number }
export interface Storage {
  read(): Promise<Snapshot>
  save(content: SiteContent, revision: string, remove: string[]): Promise<Snapshot>
  upload(bytes: Uint8Array, extension: string): Promise<Media>
  media(): Promise<Media[]>
  history(): Promise<{ id: string; date: string }[]>
  restore(id: string, revision: string): Promise<Snapshot>
}
export function mediaPath(path: string) {
  if (!/^\/media\/[a-f0-9-]+\.(jpg|png|webp)$/.test(path)) throw new Error("Invalid media path")
  return `public${path}`
}
export async function revisionOf(content: SiteContent) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(content)))
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("")
}
