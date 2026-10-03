import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import data from "./data.json"

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: "site-metadata",
    transformIndexHtml() {
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
      "@": path.resolve(__dirname, "./src"),
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
