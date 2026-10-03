import { validateContent } from "../src/content"
import { mediaPath, type Storage } from "./storage"

export type Env = Record<string, string | undefined>
const encoder = new TextEncoder()
const encode = (value: string) => btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
const decode = (value: string) => atob(value.replace(/-/g, "+").replace(/_/g, "/"))
async function signature(value: string, env: Env) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(`${env.ADMIN_USERNAME}\0${env.ADMIN_PASSWORD}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  return encode(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)))))
}
async function equal(a: string, b: string) {
  const hash = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)))
  const [left, right] = await Promise.all([hash(a), hash(b)])
  return left.reduce((result, byte, index) => result | (byte ^ right[index]), 0) === 0
}
export function imageExtension(bytes: Uint8Array) {
  if (bytes.length < 12 || bytes.length > 8 * 1024 * 1024) throw new Error("Images must be at most 8 MiB")
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpg"
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b)) return "png"
  if (new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP") return "webp"
  throw new Error("Only JPEG, PNG and WebP images are accepted")
}
export async function handleAdmin(request: Request, env: Env, storage: Storage) {
  const json = (value: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } })
  try {
    for (const name of ["ADMIN_USERNAME", "ADMIN_PASSWORD"]) if (!env[name]) return json({ error: `Missing environment variable: ${name}` }, 503)
    const url = new URL(request.url)
    const action = url.pathname.replace(/^\/api\/admin\//, "")
    const methods: Record<string, string> = { login: "POST", logout: "POST", session: "GET", content: "GET", save: "POST", upload: "POST", media: "GET", history: "GET", restore: "POST" }
    if (!methods[action]) return json({ error: "Not found" }, 404)
    if (request.method !== methods[action]) return json({ error: "Method not allowed" }, 405)
    const mutation = request.method === "POST"
    if (mutation && request.headers.get("Origin") !== url.origin) return json({ error: "Invalid origin" }, 403)
    if (Number(request.headers.get("Content-Length")) > 9 * 1024 * 1024) return json({ error: "Request too large" }, 413)
    const cookie = (value: string, age: number) => `admin_session=${value}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${age}${url.protocol === "https:" ? "; Secure" : ""}`
    if (action === "login") {
      const { username, password } = await request.json() as any
      if (typeof username !== "string" || typeof password !== "string" || !await equal(username, env.ADMIN_USERNAME!) || !await equal(password, env.ADMIN_PASSWORD!)) return json({ error: "Invalid credentials" }, 401)
      const session = { expires: Date.now() + 8 * 60 * 60 * 1000, csrf: crypto.randomUUID() }
      const payload = encode(JSON.stringify(session))
      return json({ csrf: session.csrf }, 200, { "Set-Cookie": cookie(`${payload}.${await signature(payload, env)}`, 28800) })
    }
    let session: { expires: number; csrf: string } | undefined
    try {
      const token = request.headers.get("Cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith("admin_session="))?.slice(14) || ""
      const [payload, signed] = token.split(".")
      if (signed && await equal(signed, await signature(payload, env))) session = JSON.parse(decode(payload))
    } catch { /* Invalid cookies are unauthenticated. */ }
    if (!session || session.expires <= Date.now() || typeof session.csrf !== "string") return json({ error: "Login required" }, 401)
    if (mutation && !await equal(request.headers.get("X-CSRF-Token") || "", session.csrf)) return json({ error: "Invalid CSRF token" }, 403)
    if (action === "logout") return json({ ok: true }, 200, { "Set-Cookie": cookie("", 0) })
    if (action === "session") return json({ csrf: session.csrf })
    if (action === "content") return json(await storage.read())
    if (action === "media") return json(await storage.media())
    if (action === "history") return json(await storage.history())
    if (action === "upload") {
      const form = await request.formData()
      const file = form.get("file")
      if (!(file instanceof File) || file.size > 8 * 1024 * 1024) return json({ error: "Select an image up to 8 MiB" }, 400)
      const bytes = new Uint8Array(await file.arrayBuffer())
      return json(await storage.upload(bytes, imageExtension(bytes)))
    }
    const body = await request.json() as any
    if (typeof body.revision !== "string") throw new Error("A content revision is required")
    if (action === "restore") {
      if (typeof body.id !== "string" || !/^[a-f0-9-]{16,64}$/.test(body.id)) throw new Error("Invalid history ID")
      return json(await storage.restore(body.id, body.revision))
    }
    validateContent(body.content)
    const remove = body.remove || []
    if (!Array.isArray(remove) || remove.length > 100) throw new Error("Invalid media removal list")
    remove.forEach(mediaPath)
    if (remove.some(path => JSON.stringify(body.content).includes(path))) throw new Error("Remove image references before deleting media")
    return json(await storage.save(body.content, body.revision, remove))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed"
    return json({ error: message }, message.includes("changed") ? 409 : 400)
  }
}
