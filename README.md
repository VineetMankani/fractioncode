# FractionCode website

Use the pinned pnpm version (12.3.4) from package.json. Run `pnpm dev`, `pnpm exec tsc --noEmit`, and `pnpm build`. `pnpm preview` serves the production build.

## Content and visibility

All rendered copy, logos, colours, navigation, contact details, project data, and page metadata are configured in `data.json`. Components hold layout and icon SVGs only.

- `sections`: each boolean controls an entire section, including navbar and footer. Links to disabled sections are hidden automatically.
- `enabled`: controls individual services, projects, navigation entries, hero actions, social links, deliverables, and project features.
- `show...`: controls smaller elements such as descriptions, headings, previews, project links, email, phone, WhatsApp, and social links.
- `brand`: the name, logo paths, accessible logo text, and brand visibility. Images live in `public/`; use root-relative paths.
- `theme`: background, accent, and foreground. The supplied palette is #131416 / #ff7715 / #f9f8f4.
- `metadata`: the document title and description. Vite generates these from the same JSON for the production HTML. Restart the dev server after editing metadata.
- `footer`: copyright, founder names, their LinkedIn profile URLs, and individual visibility switches. Add verified profile URLs to `footer.founders[].linkedin`; a name appears as plain text while its URL is blank.

Projects remain hidden by default. Enable `sections.projects` to display them. Mark sample projects as `kind: "demo"`; only verified delivered work should use `kind: "live"` and a real URL. Each project accepts optional `image` and `imageAlt` fields, otherwise its data-driven preview is used. Set individual feature objects to `enabled: false` to hide them.

## Contact details

The current email, phone, WhatsApp number, and social destinations are **dummy values requested for preview**. Replace `studio.email`, `studio.phoneNumber`, `studio.whatsappNumber`, and `studio.socials[].url` before publishing. Disable `studio.showPlaceholderNotice` after replacing and verifying all values.

Phone numbers should include the country code. Phone links use `tel:`; WhatsApp links use `wa.me` with digits only. Blank values are hidden, and invalid/non-HTTP social URLs are not rendered.

The email address opens a `mailto:` draft in the visitor's configured email app. For visitors without one, **Compose in Gmail** opens a browser draft, and **Copy email** offers another route. Gmail may require sign-in. Clipboard failures show a message so visitors can select and copy the visible address. Dummy contacts do not receive enquiries.

## Motion and performance

The site includes pointer-reactive logo/card tilt and light, drifting soft gradient layers, an orbiting accent, floating glass labels, and service illustrations. Gradient layers create the soft blur appearance without animating CSS blur filters.

Use the booleans in `effects` to toggle all effects, pointer interaction, ambient loops, or one-time reveals. Hero labels are editable in `hero.fragments`; each has an `enabled` flag. Each service has `showVisual` and a `visual` style (layout, code, or orbit).

Pointer updates are scoped to each scene and batched with requestAnimationFrame, directly updating CSS variables without React state changes. Animations use transforms and opacity. Ambient loops pause outside the viewport and when the document is hidden. Touch devices skip pointer effects, mobile uses fewer light layers, and reduced-motion preferences disable animations and tilt. The system uses native CSS and browser observers; no animation library is loaded into the page.
