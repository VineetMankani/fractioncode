import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { contentTemplate, validateContent } from "../src/content"
import { handleAdmin, imageExtension } from "../server/api"
import { localStorage } from "../server/local"
import { githubStorage } from "../server/github"
import { revisionOf } from "../server/storage"

test("validation rejects missing fields, executable links, HTML and invalid section order", () => {
  validateContent(contentTemplate)
  for (const mutate of [(x: any) => delete x.hero, (x: any) => x.navigation[0].href = "javascript:alert(1)", (x: any) => x.hero.heading = "<script>alert(1)</script>", (x: any) => x.sectionOrder.push("hero")]) {
    const draft = structuredClone(contentTemplate); mutate(draft); assert.throws(() => validateContent(draft))
  }
  const empty = structuredClone(contentTemplate); empty.services = []; empty.projects = []; validateContent(empty)
})
test("image signatures and maximum size are enforced", () => {
  assert.equal(imageExtension(Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0])), "png")
  assert.equal(imageExtension(Uint8Array.from([255,216,255,0,0,0,0,0,0,0,0,0])), "jpg")
  assert.equal(imageExtension(new TextEncoder().encode("RIFF0000WEBP")), "webp")
  assert.throws(() => imageExtension(new TextEncoder().encode("<svg>bad</svg>")))
  assert.throws(() => imageExtension(new Uint8Array(8 * 1024 * 1024 + 1)))
})
test("server authentication, CSRF, local persistence, conflict and restoration", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "fraction-admin-"))
  try {
    await writeFile(path.join(root, "data.json"), JSON.stringify(contentTemplate))
    const storage = localStorage(root)
    const env = { ADMIN_USERNAME: "unit-admin", ADMIN_PASSWORD: "unit-password-long" }
    let cookie = "", csrf = ""
    const request = (action: string, body?: any, headers: any = {}) => handleAdmin(new Request(`https://example.test/api/admin/${action}`, { method: body === undefined ? "GET" : "POST", headers: { Origin: "https://example.test", Cookie: cookie, "X-CSRF-Token": csrf, "Content-Type": "application/json", ...headers }, body: body === undefined ? undefined : JSON.stringify(body) }), env, storage)
    for (const action of ["session", "content", "media", "history"]) assert.equal((await request(action)).status, 401)
    for (const action of ["logout", "save", "upload", "restore"]) assert.equal((await request(action, {})).status, 401)
    assert.equal((await request("login", { username: "wrong", password: "wrong" })).status, 401)
    const login = await request("login", { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD })
    assert.match(login.headers.get("Set-Cookie")!, /HttpOnly.*SameSite=Strict.*Secure/)
    cookie = login.headers.get("Set-Cookie")!.split(";")[0]; csrf = (await login.json() as any).csrf
    assert.equal((await request("save", {}, { "X-CSRF-Token": "wrong" })).status, 403)
    assert.equal((await request("logout", {}, { Origin: "https://evil.test" })).status, 403)
    const original = await storage.read()
    const draft = structuredClone(original.content); draft.hero.heading += " Updated"
    assert.equal((await request("save", { content: draft, revision: original.revision })).status, 200)
    assert.equal(JSON.parse(await readFile(path.join(root, "data.json"), "utf8")).hero.heading, draft.hero.heading)
    assert.equal((await request("save", { content: draft, revision: original.revision })).status, 409)
    const versions = await storage.history(); assert.ok(versions.length)
    const restored = await storage.restore(versions[0].id, (await storage.read()).revision)
    assert.deepEqual(restored.content, original.content)
    const form = new FormData()
    form.append("file", new File([Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0])], "image.png", { type: "image/png" }))
    const uploaded = await handleAdmin(new Request("https://example.test/api/admin/upload", { method: "POST", headers: { Origin: "https://example.test", Cookie: cookie, "X-CSRF-Token": csrf }, body: form }), env, storage)
    assert.equal(uploaded.status, 200)
    const image = await uploaded.json() as any
    assert.equal((await storage.media()).length, 1)
    const withImage = structuredClone(original.content); withImage.projects[0].image = image.path
    await storage.save(withImage, restored.revision, [])
    const removed = await storage.save(original.content, (await storage.read()).revision, [image.path])
    assert.equal((await storage.media()).length, 0)
    const imageVersion = (await storage.history())[0]
    await storage.restore(imageVersion.id, removed.revision)
    assert.equal((await storage.read()).content.projects[0].image, image.path)
    assert.equal((await storage.media()).length, 1)
    const invalid = new FormData(); invalid.append("file", new File(["<svg>not an image</svg>"], "fake.png"))
    assert.equal((await handleAdmin(new Request("https://example.test/api/admin/upload", { method: "POST", headers: { Origin: "https://example.test", Cookie: cookie, "X-CSRF-Token": csrf }, body: invalid }), env, storage)).status, 400)
    assert.equal((await request("save", { content: draft, revision: restored.revision, remove: ["/../../secret"] })).status, 400)
    assert.equal((await handleAdmin(new Request("https://example.test/api/admin/session"), {}, storage)).status, 503)
    cookie += "tampered"; assert.equal((await request("session")).status, 401)
  } finally { assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep)); await rm(root, { recursive: true, force: true }) }
})
test("production save creates atomic tree commit and non-forced main update", async () => {
  const calls: { route: string; body: any }[] = []
  const fetcher = (async (url: any, options: any) => {
    const route = String(url).split("/repos/owner/repo/")[1]
    const body = options.body ? JSON.parse(options.body) : undefined
    calls.push({ route, body })
    const result = route === "git/ref/heads/main" ? { object: { sha: "old" } } : route.startsWith("contents/data.json") ? { content: Buffer.from(JSON.stringify(contentTemplate)).toString("base64") } : route === "git/commits/old" ? { tree: { sha: "base" } } : route === "git/trees" ? { sha: "tree" } : route === "git/commits" ? { sha: "new" } : {}
    return Response.json(result)
  }) as typeof fetch
  const env = { GITHUB_REPOSITORY: "owner/repo", GITHUB_TOKEN: "test-token", CF_PAGES_BRANCH: "main", NEXT_PUBLIC_SITE_URL: "https://example.test", NEXT_PUBLIC_ADMIN_URL: "https://example.test/admin" }
  const store = githubStorage(env, fetcher)
  const draft = structuredClone(contentTemplate); draft.hero.heading += " Changed"
  await store.save(draft, await revisionOf(contentTemplate), [])
  assert.deepEqual(calls.find(x => x.route === "git/refs/heads/main")?.body, { sha: "new", force: false })
  assert.equal(calls.find(x => x.route === "git/trees")?.body.base_tree, "base")
  assert.deepEqual(calls.find(x => x.route === "git/commits")?.body.parents, ["old"])
  await assert.rejects(() => githubStorage({ ...env, CF_PAGES_BRANCH: "preview" }, fetcher).read(), /only enabled on main/)
})

test("production upload and restoration only commit allowed media and content paths", async () => {
  const changes: any[] = []
  const id = "a".repeat(40)
  const fetcher = (async (url: any, options: any) => {
    const route = String(url).split("/repos/owner/repo/")[1]
    const body = options.body ? JSON.parse(options.body) : undefined
    let result: any = {}
    if (route === "git/ref/heads/main") result = { object: { sha: "head" } }
    if (route.startsWith("contents/data.json")) result = { content: Buffer.from(JSON.stringify(contentTemplate)).toString("base64") }
    if (route.startsWith("git/commits/")) result = { tree: { sha: "base" } }
    if (route.startsWith("commits?")) result = [{ sha: id }]
    if (route.startsWith("git/trees/base")) result = { tree: [{ path: "public/media/abcdef.png", sha: "old-image", size: 12 }, { path: "secret.txt", sha: "secret" }] }
    if (route === "git/blobs") { assert.equal(body.encoding, "base64"); result = { sha: "image" } }
    if (route === "git/trees") { changes.push(...body.tree); result = { sha: "tree" } }
    if (route === "git/commits") result = { sha: "new" }
    return Response.json(result)
  }) as typeof fetch
  const store = githubStorage({ GITHUB_REPOSITORY: "owner/repo", GITHUB_TOKEN: "fake", CF_PAGES_BRANCH: "main", NEXT_PUBLIC_SITE_URL: "https://example.test", NEXT_PUBLIC_ADMIN_URL: "https://example.test/admin" }, fetcher)
  await store.upload(new Uint8Array(12), "png")
  await store.restore(id, await revisionOf(contentTemplate))
  assert.ok(changes.every(x => x.path === "data.json" || /^public\/media\/[a-f0-9-]+\.png$/.test(x.path)))
  assert.ok(changes.some(x => x.sha === "old-image"))
  const revision = await revisionOf(contentTemplate)
  await assert.rejects(() => store.restore("b".repeat(40), revision), /Unknown history/)
})
