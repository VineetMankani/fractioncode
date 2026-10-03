import { promises as fs } from "node:fs"
import path from "node:path"
import { validateContent, type SiteContent } from "../src/content"
import { mediaPath, revisionOf, type Storage } from "./storage"

export function localStorage(root: string): Storage {
  const file = path.join(root, "data.json")
  const historyDir = path.join(root, ".admin-history")
  let pending = Promise.resolve()
  const serial = <T,>(action: () => Promise<T>): Promise<T> => {
    const result = pending.then(action)
    pending = result.then(() => {}, () => {})
    return result
  }
  const read = async () => {
    const content = JSON.parse(await fs.readFile(file, "utf8"))
    validateContent(content)
    return { content, revision: await revisionOf(content) }
  }
  const media = async () => {
    await fs.mkdir(path.join(root, "public/media"), { recursive: true })
    return Promise.all((await fs.readdir(path.join(root, "public/media"))).filter(name => /^[a-f0-9-]+\.(jpg|png|webp)$/.test(name)).map(async name => ({ path: `/media/${name}`, size: (await fs.stat(path.join(root, "public/media", name))).size })))
  }
  const save = (content: SiteContent, revision: string, remove: string[]) => serial(async () => {
    const current = await read()
    if (current.revision !== revision) throw new Error("Content changed. Reload before saving.")
    validateContent(content)
    await fs.mkdir(historyDir, { recursive: true })
    const id = crypto.randomUUID()
    const images = await media()
    await fs.mkdir(path.join(historyDir, "media"), { recursive: true })
    for (const image of images) await fs.copyFile(path.join(root, mediaPath(image.path)), path.join(historyDir, "media", path.basename(image.path)))
    await fs.writeFile(path.join(historyDir, `${id}.json`), JSON.stringify({ date: new Date().toISOString(), content: current.content, media: images }))
    const temp = `${file}.${id}.tmp`
    await fs.writeFile(temp, JSON.stringify(content, null, 2) + "\n")
    await fs.rename(temp, file)
    for (const image of remove) await fs.rm(path.join(root, mediaPath(image)), { force: true })
    return read()
  })
  return {
    read, save, media,
    upload: (bytes, extension) => serial(async () => {
      const image = `/media/${crypto.randomUUID()}.${extension}`
      await fs.mkdir(path.join(root, "public/media"), { recursive: true })
      await fs.writeFile(path.join(root, mediaPath(image)), bytes)
      return { path: image, size: bytes.length }
    }),
    history: async () => {
      await fs.mkdir(historyDir, { recursive: true })
      return (await Promise.all((await fs.readdir(historyDir)).filter(name => /^[a-f0-9-]+\.json$/.test(name)).map(async name => ({ id: name.slice(0, -5), date: JSON.parse(await fs.readFile(path.join(historyDir, name), "utf8")).date })))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
    },
    restore: async (id, revision) => {
      const snapshot = JSON.parse(await fs.readFile(path.join(historyDir, `${id}.json`), "utf8"))
      validateContent(snapshot.content)
      // Keep archived media available when restoring old content.
      for (const image of snapshot.media) await fs.copyFile(path.join(historyDir, "media", path.basename(mediaPath(image.path))), path.join(root, mediaPath(image.path)))
      return save(snapshot.content, revision, [])
    },
  }
}
