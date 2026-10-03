import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { siteData } from "./siteData"

// Also apply the configured palette outside the React root (browser overscroll).
document.documentElement.style.setProperty("--site-bg", siteData.theme.background)
document.documentElement.style.setProperty("--site-fg", siteData.theme.foreground)
document.documentElement.style.setProperty("--site-accent", siteData.theme.accent)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
