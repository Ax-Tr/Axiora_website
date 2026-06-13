# MilesWeb Deployment

## Recommended Route: Static cPanel Hosting

1. Run `npm install`.
2. Run `npm run deploy:check`.
3. Open the generated `out/` folder.
4. Upload everything inside `out/` into MilesWeb `public_html`.
5. Confirm these files exist on the server:
   - `public_html/index.html`
   - `public_html/404.html`
   - `public_html/.htaccess`
   - `public_html/_next/`
   - `public_html/images/`

## What Not To Upload

- `node_modules/`
- `.next/`
- `src/`
- `Products/`
- `*.log`
- local screenshots

## When Static Hosting Is Not Enough

Use MilesWeb Node.js hosting instead if the site later needs:

- API routes or backend form submission
- server actions
- authentication sessions
- database access
- server-side rendering on each request
- Next.js image optimization through the default server loader

## Node.js Hosting Fallback

MilesWeb's Node.js hosting can run JavaScript apps, but this project is intentionally configured as static output for simpler deployment. If you switch to Node.js hosting later, remove `output: "export"` from `next.config.ts`, restore a `start` script such as `next start`, and configure the app startup command in the MilesWeb Node.js app panel.
