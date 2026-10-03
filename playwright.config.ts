import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 90000,
  use: { baseURL: "http://127.0.0.1:4317", trace: "retain-on-failure" },
  webServer: { command: "npm run dev:admin", url: "http://127.0.0.1:4317", timeout: 180000, reuseExistingServer: false, env: { ADMIN_DEV_PORT: "4317", ADMIN_USERNAME: "browser-test-admin", ADMIN_PASSWORD: "browser-test-password-long" } },
})
