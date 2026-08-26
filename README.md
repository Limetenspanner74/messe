# Paper — Messenger

A calm, paper-textured messenger UI built with Next.js.

## Preview locally

```bash
npm install
npm run dev
```

## Build the static site

```bash
npm run build
```

This produces an `out/` folder containing static HTML, CSS, and JS files you can host anywhere.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) automatically:
   - Derives the base path from your repository name (e.g. `my-repo` → `/my-repo`)
   - Builds the static site with that base path
   - Publishes the `out/` folder to GitHub Pages

The base path is set automatically during the GitHub Actions build via the `NEXT_PUBLIC_BASE_PATH` environment variable. No manual configuration needed.

## Preview the export locally

The `out/` folder uses absolute paths, so open it through a static server rather than `file://`:

```bash
npx serve out
```
