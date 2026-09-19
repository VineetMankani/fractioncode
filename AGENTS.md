# Repository Guidelines

## Project Structure & Module Organization

This is a Vite, React, and TypeScript single-page site. `src/App.tsx` assembles the page; `src/components/` contains sections and shared visual elements; `src/hooks/` holds reusable hooks. Edit website copy, services, project entries, and contact settings in the root `data.json`; `src/siteData.ts` defines its TypeScript shape. Put static images in `public/` and reference them with root-relative paths such as `/projects/client.webp`. `src/index.css` contains Tailwind setup and site-wide styles. `dist/` is generated output and should not be edited.

## Build, Test, and Development Commands

- `pnpm dev`: start the local Vite server.
- `pnpm exec tsc --noEmit`: check TypeScript without writing output.
- `pnpm build`: create the production site in `dist/`.
- `pnpm preview`: serve the production build locally for a final check.

Use the pinned pnpm version in `package.json` when installing dependencies. There is currently no `test` or `lint` script.

## Coding Style & Naming Conventions

Follow the existing two-space indentation, double quotes, and no-semicolon style in TypeScript and TSX. Use PascalCase for React component files (`Projects.tsx`), camelCase for hooks (`usePointer.ts`), and functional components. Prefer Tailwind utility classes for component styling; keep shared CSS in `src/index.css`. Preserve the black-and-white visual system, glass treatments, and Instrument Serif and Barlow typography unless a design change is requested.

## Content & Configuration

Keep editable project and contact content in `data.json`, not repeated inside components. Mark sample projects as `"kind": "demo"`; use `"live"` and a verified URL only for delivered work. Set `sections.projects` to `false` to hide Projects and its navigation link. Confirm the enquiry email and WhatsApp number before publishing. Do not commit secrets or private client information to `data.json`.

## Testing Guidelines

No test framework or coverage threshold is configured. For UI changes, run the TypeScript check and production build, then inspect desktop and mobile layouts, navigation anchors, project links, and contact actions. If tests are added later, colocate focused `*.test.tsx` files with the affected components and add a documented test script.

## Commit & Pull Request Guidelines

This repository has no commits yet, so no historical commit convention exists. Use short imperative subjects such as `Add project previews from data.json`. In pull requests, describe the user-facing change, list verification commands, link any relevant issue, and include desktop and mobile screenshots for visual changes. Identify placeholder content that still needs real client data.
