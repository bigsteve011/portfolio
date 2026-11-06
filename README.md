# stephen-omowumi.pages.dev

Personal site of Stephen Omowumi, Cloud Security, DevSecOps & GRC Engineer.
It is a static [Astro](https://astro.build) site on Cloudflare Pages that keeps itself current:

- **Build-time data**: `scripts/fetch-data.mjs` pulls public repositories, the contribution calendar,
  upstream pull requests. Each source is optional; a failure is recorded, never hidden.
- **Control plane**: the home page panel reports the site's own pipeline. `/status.json` is written on every
  build and checked live from the visitor's browser.
- **Nightly deploys**: `.github/workflows/deploy.yml` builds and deploys on push to `main` and every night.

## Local development

```bash
npm install
GITHUB_TOKEN=$(gh auth token) npm run fetch-data   # optional token enables the contribution calendar
npm run dev
npm run build    # fetch data, type-check, build to dist/
```

## Content

| What | Where |
|---|---|
| Profile, stats, certifications | `src/data/profile.ts` |
| Case studies | `src/content/case-studies/*.md` |
| Headshot | `src/assets/headshot.png` |
| Security headers (CSP, HSTS) | `public/_headers` |

## Repository secrets

| Secret | Used by | Notes |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy | Token with *Cloudflare Pages: Edit* only |
| `CLOUDFLARE_ACCOUNT_ID` | Deploy | |
| `GH_READ_TOKEN` | Deploy (optional) | Fine-grained, public repositories, read-only |
