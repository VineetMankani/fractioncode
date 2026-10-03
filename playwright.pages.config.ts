import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/pages",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:4318" },
  webServer: {
    command: "npx --yes wrangler@3.114.17 pages dev dist --ip 127.0.0.1 --port 4318 --binding ADMIN_USERNAME=pages-test-admin --binding ADMIN_PASSWORD=pages-test-password",
    url: "http://127.0.0.1:4318/",
    timeout: 180000,
  },
})
