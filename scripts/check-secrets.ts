import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { loadEnv } from "vite"
const env = { ...loadEnv("production", process.cwd(), ""), ...loadEnv("development", process.cwd(), ""), ...process.env }
const secrets = ["ADMIN_USERNAME", "ADMIN_PASSWORD", "GITHUB_TOKEN"].map(key => env[key]).filter((value): value is string => !!value)
if (!secrets.length) throw new Error("Configure test or deployment credentials before checking exported files")
async function scan(directory: string) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, file.name)
    if (file.isDirectory()) await scan(name)
    else { const bytes = await readFile(name); if (secrets.some(secret => bytes.includes(Buffer.from(secret)))) throw new Error(`Configured credential found in ${name}`) }
  }
}
await scan("dist")
console.log("Export contains no configured credentials")
