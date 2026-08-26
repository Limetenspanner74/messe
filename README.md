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
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds the site and publishes the `out/` folder to Pages.

The site is configured with the base path `/paper-messenger`. If your repository is named differently, update `basePath` in `next.config.mjs` to `/<your-repo-name>`.

## Preview the export locally

The `out/` folder uses absolute paths, so open it through a static server rather than `file://`:

```bash
npx serve out
```
