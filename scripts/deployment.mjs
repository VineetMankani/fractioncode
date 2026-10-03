import { writeFileSync } from "node:fs"

// Pages exposes CF_PAGES_BRANCH at build time. Retain only this non-secret value
// for Functions deployments where the automatic variable is not a binding.
writeFileSync(new URL("../server/deployment.json", import.meta.url), JSON.stringify({ branch: process.env.CF_PAGES_BRANCH || "" }, null, 2) + "\n")
