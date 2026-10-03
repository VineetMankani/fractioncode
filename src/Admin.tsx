import { useEffect, useRef, useState } from "react"
import { validateContent, type SiteContent } from "./content"
import collectionTemplates from "./collectionTemplates.json" with { type: "json" }
import "./admin.css"

type Snapshot = { content: SiteContent; revision: string }
type Media = { path: string; size: number }
function label(value: string) { return value.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()) }
function Field({ value, template, name, change }: { value: any; template: any; name: string; change: (value: any) => void }) {
  if (typeof value === "boolean") return <label className="admin-check"><input type="checkbox" checked={value} onChange={event => change(event.target.checked)} />{label(name)}</label>
  if (typeof value === "string") return <label className="admin-field">{label(name)}<textarea rows={value.length > 120 ? 3 : 1} value={value} onChange={event => change(event.target.value)} />{["image", "logo", "icon"].includes(name) && value && <img src={value} alt="Selected image" className="admin-thumbnail" />}</label>
  if (Array.isArray(value)) return <fieldset><legend>{label(name)} ({value.length})</legend>
    {value.map((item, index) => <div className="admin-item" key={index}>
      <div className="admin-row"><strong>{index + 1}</strong><button type="button" disabled={index === 0} aria-label={`Move ${name} ${index + 1} up`} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; change(next) }}>↑</button><button type="button" disabled={index === value.length - 1} aria-label={`Move ${name} ${index + 1} down`} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; change(next) }}>↓</button>{name !== "sectionOrder" && <button type="button" onClick={() => { if (confirm(`Remove ${name} item ${index + 1}?`)) change(value.filter((_, i) => i !== index)) }}>Remove</button>}</div>
      <Field value={item} template={template?.[0]} name={typeof item === "string" ? name : "Item"} change={next => change(value.map((old, i) => i === index ? next : old))} />
    </div>)}
    {name !== "sectionOrder" && <button type="button" disabled={!template?.length} onClick={() => { const item = structuredClone(template[0]); if (item && typeof item === "object") { if ("id" in item) item.id = crypto.randomUUID(); if ("index" in item) item.index = String(value.length + 1).padStart(2, "0") } change([...value, item]) }}>Add {label(name)} item</button>}
  </fieldset>
  return <div>{Object.entries(value).map(([key, item]) => <Field key={key} value={item} template={template?.[key]} name={key} change={next => change({ ...value, [key]: next })} />)}</div>
}

export default function Admin() {
  const [csrf, setCsrf] = useState("")
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [draft, setDraft] = useState<SiteContent>()
  const [media, setMedia] = useState<Media[]>([])
  const [history, setHistory] = useState<{ id: string; date: string }[]>([])
  const [remove, setRemove] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)
  const iframe = useRef<HTMLIFrameElement>(null)
  const dirty = !!draft && (JSON.stringify(draft) !== JSON.stringify(snapshot?.content) || remove.length > 0)
  const api = async (action: string, body?: any, token = csrf) => {
    const form = body instanceof FormData
    const response = await fetch(`/api/admin/${action}`, { method: body === undefined ? "GET" : "POST", headers: body === undefined ? {} : { "X-CSRF-Token": token, ...(form ? {} : { "Content-Type": "application/json" }) }, body: body === undefined ? undefined : form ? body : JSON.stringify(body) })
    const result = await response.json()
    if (!response.ok) { if (response.status === 401 && action !== "login") setCsrf(""); throw new Error(result.error) }
    return result
  }
  const load = async (token: string) => {
    const [content, images, versions] = await Promise.all([api("content", undefined, token), api("media", undefined, token), api("history", undefined, token)])
    setSnapshot(content); setDraft(content.content); setMedia(images); setHistory(versions); setRemove([])
  }
  const run = async (action: () => Promise<void>) => {
    setBusy(true); setMessage("")
    try { await action() } catch (error) { setMessage(error instanceof Error ? error.message : "Request failed") } finally { setBusy(false) }
  }
  useEffect(() => { api("session").then(async session => { setCsrf(session.csrf); await load(session.csrf) }).catch(error => { if (error.message !== "Login required") setMessage(error.message) }) }, [])
  useEffect(() => {
    const warning = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = "" } }
    window.addEventListener("beforeunload", warning)
    return () => window.removeEventListener("beforeunload", warning)
  }, [dirty])
  const sendPreview = () => {
    if (!draft) return
    try { validateContent(draft); iframe.current?.contentWindow?.postMessage({ type: "admin-preview", content: draft }, location.origin) } catch (error) { setMessage((error as Error).message) }
  }
  useEffect(() => { if (preview) sendPreview() }, [draft, preview])
  useEffect(() => {
    const ready = (event: MessageEvent) => {
      if (event.origin === location.origin && event.source === iframe.current?.contentWindow && event.data?.type === "admin-preview-ready") sendPreview()
    }
    window.addEventListener("message", ready)
    return () => window.removeEventListener("message", ready)
  }, [draft])
  return <div className="admin-shell">
    <header><div><h1>FractionCode · Content editor</h1><p>{dirty ? "Unsaved changes" : "Content and media"}</p></div><a href="/" target="_blank" rel="noopener">Open website ↗</a></header>
    {message && <p role="status" className="admin-message">{message}</p>}
    {!csrf ? <form className="admin-login" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); run(async () => { const session = await api("login", { username: form.get("username"), password: form.get("password") }); setCsrf(session.csrf); await load(session.csrf) }) }}>
      <h2>Admin login</h2><label>Username<input name="username" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={busy}>Log in</button>
    </form> : <>
      <nav className="admin-toolbar"><button disabled={busy || !draft || !dirty} onClick={() => run(async () => { validateContent(draft); const saved = await api("save", { content: draft, revision: snapshot?.revision, remove }); setSnapshot(saved); setDraft(saved.content); setRemove([]); setHistory(await api("history")); setMedia(await api("media")); setMessage("Saved. Refresh the local website; production updates appear after Cloudflare rebuilds.") })}>Save changes</button><button disabled={!draft} onClick={() => { if (!preview) { try { validateContent(draft) } catch (error) { setMessage((error as Error).message); return } } setPreview(!preview) }}>{preview ? "Close preview" : "Preview changes"}</button><button disabled={busy} onClick={() => { if (!dirty || confirm("Discard unsaved changes and reload?")) run(() => load(csrf)) }}>Reload content</button><button disabled={busy} onClick={() => { if (!dirty || confirm("Discard unsaved changes and log out?")) run(async () => { await api("logout", {}); setCsrf(""); setDraft(undefined); setSnapshot(undefined) }) }}>Log out</button></nav>
      {preview && <div className="admin-preview"><p>Unsaved preview · links stay inside this frame</p><iframe title="Website preview" ref={iframe} src="/?admin-preview=1" onLoad={sendPreview} /></div>}
      {draft && <div className="admin-grid"><main>{Object.entries(draft).map(([key, value]) => <details key={key}><summary>{label(key)}</summary><Field name={key} value={value} template={(collectionTemplates as any)[key]} change={next => setDraft({ ...draft, [key]: next })} /></details>)}</main>
        <aside><h2>Media library</h2><p>JPEG, PNG or WebP · up to 8 MiB. Uploads are saved immediately. Copy a path into an image field.</p><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} aria-label="Upload image" onChange={event => { const file = event.target.files?.[0]; if (!file) return; event.target.value = ""; run(async () => { const form = new FormData(); form.append("file", file); const image = await api("upload", form); setMedia(await api("media")); setMessage(`Uploaded ${image.path}. Production image previews become available after the rebuild.`) }) }} />
          {media.map(image => <div className="admin-media" key={image.path}><img src={image.path} alt="Uploaded media" /><input aria-label="Media path" value={image.path} readOnly onFocus={event => event.target.select()} /><button disabled={busy} onClick={() => { if (confirm("Delete this image on the next save? Remove its content references first.")) setRemove([...new Set([...remove, image.path])]) }}>{remove.includes(image.path) ? "Queued for deletion" : "Delete image"}</button></div>)}
          <h2>Content history</h2><p>Restore replaces the current content. A new history entry preserves the content being replaced.</p>{history.map(version => <div className="admin-history" key={version.id}><time>{new Date(version.date).toLocaleString()}</time><button disabled={busy} onClick={() => { if (confirm("Restore this version and discard unsaved changes?")) run(async () => { await api("restore", { id: version.id, revision: snapshot?.revision }); await load(csrf); setMessage("Version restored. Production will rebuild.") }) }}>Restore</button></div>)}
        </aside></div>}
    </>}
  </div>
}
