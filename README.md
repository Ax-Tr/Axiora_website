# Axiora 3D Website

This is a Next.js 3D website for Axiora Global Solutions. It is configured for static export so it can be hosted on MilesWeb cPanel/shared hosting by uploading the generated `out/` files to `public_html`.

## Project Layout

- `src/app/` - Next.js app entry, layout, global styles.
- `src/components/three/` - Three.js / React Three Fiber scene.
- `src/components/hud/` - overlay UI, assistant, comparison, contact panels.
- `src/context/` - product data and UI state.
- `public/images/` - deployment-ready website images.
- `public/.htaccess` - Apache rules copied into the exported site.
- `Products/` - source product notes only; not required for hosting.
- `deployment/milesweb/` - MilesWeb upload checklist and server notes.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build For MilesWeb

```bash
npm run deploy:check
```

This runs linting and creates the static export in `out/`.

Upload the contents of `out/` to your MilesWeb domain's `public_html` folder. Do not upload `src/`, `.next/`, `node_modules/`, logs, screenshots, or the `Products/` source notes.

Preview the exported site locally with:

```bash
npm run preview:static
```

## Hosting Notes

The current site does not need a Node.js server after build. It is safest to host it as static HTML/CSS/JS on MilesWeb cPanel hosting.

MilesWeb also sells Node.js hosting, but that is only needed if you later add server APIs, database-backed forms, authentication, or dynamic server rendering.
