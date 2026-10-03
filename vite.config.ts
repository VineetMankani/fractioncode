import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: "site-metadata",
    transformIndexHtml() {
      const data = JSON.parse(readFileSync(new URL("./data.json", import.meta.url), "utf8"))
      return [
        { tag: "title", children: data.metadata.title, injectTo: "head" },
        { tag: "meta", attrs: { name: "description", content: data.metadata.description }, injectTo: "head" },
        { tag: "meta", attrs: { name: "theme-color", content: data.theme.background }, injectTo: "head" },
        { tag: "link", attrs: { rel: "icon", href: data.brand.icon }, injectTo: "head" },
      ]
    },
  }],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
})
