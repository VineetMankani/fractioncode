import { createServer } from "node:http"
import { createServer as createViteServer, loadEnv } from "vite"
import { handleAdmin } from "./api"
import { localStorage } from "./local"

const env = { ...loadEnv("development", process.cwd(), ""), ...process.env }
for (const name of ["ADMIN_USERNAME", "ADMIN_PASSWORD"]) if (!env[name]) throw new Error(`Missing ${name}. Create .env.local using .env.example.`)
const vite = await createViteServer({ server: { middlewareMode: true, watch: { ignored: ["**/data.json", "**/.admin-history/**"] } }, appType: "spa" })
const files = localStorage(process.cwd())
const storage = {
  ...files,
  save: async (...args: Parameters<typeof files.save>) => { const saved = await files.save(...args); vite.moduleGraph.invalidateAll(); return saved },
  restore: async (...args: Parameters<typeof files.restore>) => { const saved = await files.restore(...args); vite.moduleGraph.invalidateAll(); return saved },
}
const port = Number(env.ADMIN_DEV_PORT || "3000")
createServer(async (incoming, outgoing) => {
  if (!incoming.url?.startsWith("/api/admin/")) return vite.middlewares(incoming, outgoing)
  try {
    const chunks: Buffer[] = []
    let size = 0
    for await (const chunk of incoming) {
      size += chunk.length
      if (size > 9 * 1024 * 1024) { outgoing.writeHead(413).end(); return }
      chunks.push(chunk)
    }
    const headers = new Headers()
    for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value)
    const method = incoming.method || "GET"
    const request = new Request(`http://${incoming.headers.host}${incoming.url}`, { method, headers, body: method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks) })
    const response = await handleAdmin(request, env, storage)
    outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()))
    outgoing.end(Buffer.from(await response.arrayBuffer()))
  } catch { outgoing.writeHead(500).end("Local admin request failed") }
}).listen(port, "127.0.0.1", () => console.log(`Website: http://127.0.0.1:${port} — Admin: http://127.0.0.1:${port}/admin`))
