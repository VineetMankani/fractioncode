import { validateContent, type SiteContent } from "../src/content"
import { mediaPath, revisionOf, type Storage } from "./storage"
import type { Env } from "./api"

export function githubStorage(env: Env, fetcher: typeof fetch = fetch): Storage {
  const api = async (route: string, method = "GET", body?: unknown): Promise<any> => {
    for (const name of ["GITHUB_REPOSITORY", "GITHUB_TOKEN", "CF_PAGES_BRANCH", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_ADMIN_URL"]) if (!env[name]) throw new Error(`Missing environment variable: ${name}`)
    if (!/^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPOSITORY!)) throw new Error("Invalid GITHUB_REPOSITORY")
    if (env.CF_PAGES_BRANCH !== "main") throw new Error("Production admin writes are only enabled on main")
    const response = await fetcher(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/${route}`, { method, headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": "FractionCode-Admin", "X-GitHub-Api-Version": "2022-11-28" }, body: body === undefined ? undefined : JSON.stringify(body) })
    if (!response.ok) throw new Error(response.status === 422 ? "Repository changed. Reload before saving." : `GitHub request failed (${response.status}); check repository token and branch permissions`)
    return response.json()
  }
  const head = async () => (await api("git/ref/heads/main")).object.sha as string
  const at = async (sha: string) => {
    const file = await api(`contents/data.json?ref=${sha}`)
    const content = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g, "")), c => c.charCodeAt(0))))
    validateContent(content)
    return { content, revision: await revisionOf(content) }
  }
  const tree = async (sha: string) => {
    const commit = await api(`git/commits/${sha}`)
    const result = await api(`git/trees/${commit.tree.sha}?recursive=1`)
    if (result.truncated) throw new Error("Repository tree is too large")
    return { base: commit.tree.sha, entries: result.tree as { path: string; sha: string; size: number }[] }
  }
  const commit = async (sha: string, changes: any[], message: string) => {
    const parent = await api(`git/commits/${sha}`)
    const next = await api("git/trees", "POST", { base_tree: parent.tree.sha, tree: changes })
    const saved = await api("git/commits", "POST", { message, tree: next.sha, parents: [sha] })
    await api("git/refs/heads/main", "PATCH", { sha: saved.sha, force: false })
  }
  const save = async (content: SiteContent, revision: string, remove: string[]) => {
    validateContent(content)
    const sha = await head()
    if ((await at(sha)).revision !== revision) throw new Error("Content changed. Reload before saving.")
    await commit(sha, [{ path: "data.json", mode: "100644", type: "blob", content: JSON.stringify(content, null, 2) + "\n" }, ...remove.map(image => ({ path: mediaPath(image), mode: "100644", type: "blob", sha: null }))], "Update website content from admin")
    return { content, revision: await revisionOf(content) }
  }
  return {
    read: async () => at(await head()), save,
    media: async () => (await tree(await head())).entries.filter(x => /^public\/media\/[a-f0-9-]+\.(jpg|png|webp)$/.test(x.path)).map(x => ({ path: x.path.slice(6), size: x.size })),
    upload: async (bytes, extension) => {
      const sha = await head()
      const image = `/media/${crypto.randomUUID()}.${extension}`
      let binary = ""
      for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768))
      const blob = await api("git/blobs", "POST", { content: btoa(binary), encoding: "base64" })
      await commit(sha, [{ path: mediaPath(image), mode: "100644", type: "blob", sha: blob.sha }], "Upload website image from admin")
      return { path: image, size: bytes.length }
    },
    history: async () => (await api("commits?sha=main&path=data.json&per_page=30")).map((item: any) => ({ id: item.sha, date: item.commit.author.date })),
    restore: async (id, revision) => {
      const history = await api("commits?sha=main&path=data.json&per_page=30")
      if (!history.some((item: any) => item.sha === id)) throw new Error("Unknown history entry")
      const sha = await head()
      if ((await at(sha)).revision !== revision) throw new Error("Content changed. Reload before restoring.")
      const snapshot = await at(id)
      const images = (await tree(id)).entries.filter(x => /^public\/media\/[a-f0-9-]+\.(jpg|png|webp)$/.test(x.path))
      await commit(sha, [{ path: "data.json", mode: "100644", type: "blob", content: JSON.stringify(snapshot.content, null, 2) + "\n" }, ...images.map(x => ({ path: x.path, mode: "100644", type: "blob", sha: x.sha }))], "Restore website content from admin history")
      return snapshot
    },
  }
}
