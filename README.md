# SNYWEB website

Run `pnpm dev` for local development and `pnpm build` for a production build.

## Edit the website content

The hero description, service details, project cards, and contact copy live in [`data.json`](./data.json).

- The three current project cards are **demo concepts**. Replace them with delivered work when you have the names, descriptions, screenshots and live URLs. Set `kind` to `live` for a delivered site.
- `image` is optional. If supplied, place the screenshot in `public/` and use a path such as `/projects/example.webp`. Without an image, the card uses its `preview` colors and text when provided, or a simple title panel.
- Set `sections.projects` to `false` to hide the entire Projects section and its Work navigation link. Set it back to `true` when ready.
- The email address in `studio.email` is the one already used by the original site. Confirm that this inbox receives messages before publishing.
- Add a WhatsApp number with country code and digits only to `studio.whatsappNumber` to show a WhatsApp link. Leave it empty to hide that option.

Example project entry:

```json
{
  "id": "client-website",
  "kind": "live",
  "title": "Client website name",
  "category": "Business website",
  "description": "A short, factual description of the delivered site.",
  "features": ["A real feature", "Another useful feature"],
  "url": "https://client.example",
  "image": "/projects/client.webp",
  "imageAlt": "Screenshot of the client website home page"
}
```
