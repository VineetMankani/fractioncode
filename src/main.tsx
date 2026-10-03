import { StrictMode, lazy, Suspense, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { siteData, setPreviewContent } from "./siteData"
import { validateContent } from "./content"

const Admin = lazy(() => import("./Admin"))
function PublicSite() {
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (new URLSearchParams(location.search).get("admin-preview") !== "1" || window.parent === window) return
    const preview = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== "admin-preview") return
      try { validateContent(event.data.content); setPreviewContent(event.data.content); document.title = siteData.metadata.title; setRevision(value => value + 1) } catch { /* Reject invalid drafts. */ }
    }
    const stopLinks = (event: MouseEvent) => { const anchor = (event.target as Element).closest("a"); if (anchor && !anchor.getAttribute("href")?.startsWith("#")) event.preventDefault() }
    window.addEventListener("message", preview)
    window.parent.postMessage({ type: "admin-preview-ready" }, location.origin)
    document.addEventListener("click", stopLinks)
    return () => { window.removeEventListener("message", preview); document.removeEventListener("click", stopLinks) }
  }, [])
  return <App key={revision} />
}

// Also apply the configured palette outside the React root (browser overscroll).
document.documentElement.style.setProperty("--site-bg", siteData.theme.background)
document.documentElement.style.setProperty("--site-fg", siteData.theme.foreground)
document.documentElement.style.setProperty("--site-accent", siteData.theme.accent)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<p>Loading…</p>}>{/^\/admin\/?$/.test(location.pathname) ? <Admin /> : <PublicSite />}</Suspense>
  </StrictMode>,
)
