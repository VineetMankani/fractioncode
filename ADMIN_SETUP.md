# Admin setup and client handoff

The public Vite website stays at `/`; the editor is at `/admin` on the same origin. This project does not use Next.js. The production build remains static in `dist`, with Cloudflare Pages Functions handling only `/api/admin/*`. No database or separate admin service is needed.

## Local use

Use Node 22.14 or newer and the pinned `pnpm@12.3.4` (`npx pnpm@12.3.4 install`). Copy `.env.example` to `.env.local` and set `ADMIN_USERNAME` and a long, unique `ADMIN_PASSWORD`. Run `npm run dev:admin`, then open `http://localhost:3000/admin`. This single process serves both the website and API, bound to the local computer. GitHub and Cloudflare are unnecessary locally. Missing credentials stop startup with a clear error.

The editor loads `data.json`. Expand groups to edit plain text, links, colors, visibility, navigation and section order. Collection controls add, remove and reorder entries, including nested lists. New items copy a stored collection template and receive a new project ID or service index; edit their copy before saving. Collection templates remain available when a collection is empty. Preview shows the unsaved draft in the existing public layout. Refresh the public page after saving locally.

Upload JPEG, PNG or WebP files up to 8 MiB in Media library. Copy the displayed path into `image`, `logo` or `icon`; replacing that field replaces the image. Clear the field to remove the reference. Project images have `imageAlt` and `imagePosition` (for example `50% 0%`). Brand images have alt text and logo positioning. Delete queues uploaded media for removal on the next content save; remove content references first. Uploads save immediately, even when the content draft is unsaved. The original brand assets remain editable by reference and are not deleted by the media API.

Local saves write `data.json` atomically and archive the previous content plus uploaded media in ignored `.admin-history`. History lists the latest 30 snapshots. Restoration saves a new snapshot and brings back referenced archived media. Retain that directory if local restoration is needed. Production history comes from the latest 30 repository commits affecting `data.json`; restoration creates a new commit and retrieves historical media. Neither mode rewrites Git history.

## Cloudflare Pages and GitHub

Connect the GitHub repository using Cloudflare Pages Git integration. Choose `main` as the production branch, build command `npx pnpm@12.3.4 install --frozen-lockfile && npx pnpm@12.3.4 run validate:content && npx pnpm@12.3.4 run build`, and build output directory `dist`. Keep the root `functions` directory in the repository. There is intentionally no `wrangler.jsonc` or `pages_build_output_dir`; dashboard variables remain manageable there. The `/admin` rewrite and SPA fallback serve the static application, while `_routes.json` restricts function invocation to the API paths.

Create a fine-grained GitHub personal access token restricted to this repository with **Contents: read and write** (Metadata read is implicit). Set expiration and arrange renewal with the owner. The token must be permitted to push to `main`; branch protection that requires pull requests will reject admin saves. GitHub App permissions and Actions write are unnecessary. Commits always target `main` and use non-forced updates. Concurrent changes produce a conflict message; reload and apply the draft again.

Set these variables in the Cloudflare Pages **production** environment:

- Text `ADMIN_USERNAME`: fixed login username.
- Secret `ADMIN_PASSWORD`: fixed login password; also derives the session signing key. Changing either credential invalidates existing sessions.
- Text `GITHUB_REPOSITORY`: `owner/repository`.
- Secret `GITHUB_TOKEN`: the token described above.
- Text `NEXT_PUBLIC_SITE_URL`: canonical public URL, such as `https://example.com`.
- Text `NEXT_PUBLIC_ADMIN_URL`: same-origin editor URL, such as `https://example.com/admin`.

The last two names are retained for deployment compatibility; Vite does not expose them to the browser and the app uses same-origin paths. Cloudflare supplies `CF_PAGES_BRANCH` during its build. The build records only that non-secret branch value in a server module so Functions do not depend on it being a runtime binding; do not add `CONTENT_BRANCH`. Run the normal build before bundling Functions. Functions reject repository operations unless `CF_PAGES_BRANCH` is `main`. Do not give preview deployments production write credentials. Missing production variables return clear API errors without revealing their values.

After adding or changing variables, redeploy the current production commit. Each admin content save, restoration or upload commits to `main`; Cloudflare Git integration builds it automatically. The editor reads the latest repository content immediately, while public content and uploaded image previews appear after the successful deployment. Check the deployment status if they have not appeared. Upload first, assign its path, then save content. Files may trigger separate builds.

Add the domain under the Pages project's Custom domains tab and follow Cloudflare's DNS instructions. Use the same domain for `/` and `/admin`; update both URL variables and redeploy. Sessions use signed HttpOnly, SameSite=Strict cookies, Secure on HTTPS, expire after eight hours, and require same-origin mutations plus a CSRF token after login. Log out on shared devices. Credentials and token are server-only and must never use a `VITE_` prefix or go into JSON, commits, screenshots or client source.

## Verification and handoff

Run `npm run validate:content`, `npm run typecheck`, `npm test`, `npm run test:browser`, `npm run build` and `npm run check:secrets`. Install the browser once with `npx playwright install chromium`. Browser tests start the local admin server with temporary test credentials on isolated port 4317 and restore content afterward. Local development defaults to port 3000; optional local ADMIN_DEV_PORT changes it. If your machine proxies localhost requests, exclude localhost and 127.0.0.1 using NO_PROXY. The secret scan checks configured username/password/token values against every exported file; supply test credentials through the environment if deployment credentials are unavailable.

Tests derive visible collection counts and copy from the JSON. Unit tests exercise authentication, CSRF, validation, signatures, local save/conflicts/history/restoration and mock GitHub atomic writes; the mock is not proof of a live deployment. Before handoff, verify production login, image upload, save/rebuild and restore using the actual Pages site and repository token.

Give the client the public URL, `/admin` URL, credentials through a private channel, media/copy instructions, token renewal ownership and access to deployment logs. Confirm the enquiry email, WhatsApp and phone numbers before publishing: the current numbers are placeholders. Back up the repository and local `.admin-history` where applicable. Keep sample projects marked `demo`; change to `live` only for delivered sites with verified URLs.
