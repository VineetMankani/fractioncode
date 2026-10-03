import { test, expect } from "@playwright/test"
import data from "../../data.json" with { type: "json" }

for (const route of ["/admin", "/admin/"]) {
  test(`${route} opens the admin login without redirecting to the homepage`, async ({ page }) => {
    await page.goto(route)
    await expect(page).toHaveURL(/\/admin\/?$/)
    await expect(page.getByRole("heading", { name: "Admin login", exact: true })).toBeVisible()
    await expect(page.getByLabel("Username", { exact: true })).toBeVisible()
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
  })
}

test("public homepage and authenticated API routing stay separate", async ({ page, request }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(data.hero.heading)
  const response = await request.get("/api/admin/session")
  expect(response.status()).toBe(401)
  expect(await response.json()).toEqual({ error: "Login required" })
})
