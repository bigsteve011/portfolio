---
title: 'This site: a portfolio built like a secure pipeline'
summary: 'A static site whose repository list and live status diagram come from its own build, served with a strict security policy, and which only shows claims a public repository can back.'
order: 4
role: 'Design, build and operations'
period: 'Nov 2026'
status: 'Public source'
source: 'https://github.com/bigsteve011/portfolio'
stack: ['Astro', 'TypeScript', 'Cloudflare Pages', 'Wrangler', 'GitHub Actions', 'GitHub API', 'Content-Security-Policy']
diagram: 'site'
core: 'The site applies the same rules I apply to cloud platforms: least privilege, no inline code, and evidence for every claim.'
tldr:
  problem: 'A portfolio goes stale the week it is published, and most of what portfolios claim cannot be checked.'
  decision: 'Generate the changing parts from the GitHub API at build time, show the build pipeline on the home page, lock the site down with strict security headers, and publish nothing a repository cannot back.'
  result: 'A static site with no server to patch, a status diagram measured from the visitor''s browser, a CSP with nothing inline, and case studies whose every decision links to a file in a public repository.'
decisions:
  - title: 'Every data source is optional; failures are shown, not hidden'
    decision: 'The build fetches each source inside a wrapper that records failures instead of throwing. A GitHub API outage produces a warning on the status diagram, not a broken site.'
    options:
      - 'Fail the build when an API fails: the site cannot be updated whenever GitHub has a bad hour.'
      - 'Ship with what is available and say so.'
    tradeoff: 'A build can ship with a partial view; the status diagram makes that visible.'
    evidence:
      - { label: 'scripts/fetch-data.mjs', url: 'https://github.com/bigsteve011/portfolio/blob/main/scripts/fetch-data.mjs' }
  - title: 'Static output, no server'
    decision: 'Astro renders plain HTML at build time and Cloudflare Pages serves it from the edge. There is no runtime, no database and no API key in the browser, so there is nothing to patch or breach.'
    options:
      - 'Server-side rendering with live API calls: always fresh, and a server to run, patch and rate-limit.'
      - 'Static output, rebuilt when something changes.'
    tradeoff: 'Content is as fresh as the last build; the footer says exactly when that was.'
    evidence:
      - { label: 'astro.config.mjs', url: 'https://github.com/bigsteve011/portfolio/blob/main/astro.config.mjs' }
  - title: 'A strict CSP with nothing inline'
    decision: 'script-src and style-src are both self, frames are denied and HSTS is preloaded. All JavaScript lives in external files and diagrams are SVG with no style attributes. CI fails a pull request if the build output contains anything inline.'
    options:
      - 'Allow unsafe-inline: easier, and it removes most of what a CSP is for.'
      - 'Make the build produce nothing inline, and test for it.'
    tradeoff: 'Some framework conveniences are off.'
    evidence:
      - { label: 'public/_headers', url: 'https://github.com/bigsteve011/portfolio/blob/main/public/_headers' }
      - { label: '.github/workflows/ci.yml', url: 'https://github.com/bigsteve011/portfolio/blob/main/.github/workflows/ci.yml' }
  - title: 'Least-privilege deployment'
    decision: 'The deploy workflow has read-only repository permissions and deploys with a Cloudflare token scoped to Pages only. Until that secret exists, the deploy step is skipped and the workflow still runs as a build check.'
    options:
      - 'A global Cloudflare API key in CI: one leak exposes the whole account.'
      - 'A token limited to Cloudflare Pages: Edit.'
    tradeoff: 'One more secret to rotate.'
    evidence:
      - { label: '.github/workflows/deploy.yml', url: 'https://github.com/bigsteve011/portfolio/blob/main/.github/workflows/deploy.yml' }
  - title: 'Only evidence-backed content'
    decision: 'Repositories appear only if they are on a curated showcase list, and every decision in a case study links to the file that implements it.'
    options:
      - 'List every public repository automatically.'
      - 'Curate, and cite the evidence.'
    tradeoff: 'Less on the page; everything on it holds up.'
    evidence:
      - { label: 'src/data/showcase-repos.json', url: 'https://github.com/bigsteve011/portfolio/blob/main/src/data/showcase-repos.json' }
failures:
  - { failure: 'GitHub API down during a build', detection: 'Fetch wrapper records the error', mitigation: 'Build ships; the diagram node shows a warning', evidence: 'fetch-data.mjs' }
  - { failure: 'Inline script or style slips in', detection: 'CI grep on the build output', mitigation: 'Pull request fails before merge', evidence: 'ci.yml' }
  - { failure: 'Visitor has a stale page', detection: 'Live status.json build differs from the page', mitigation: 'Status line says a newer build is live', evidence: 'control-plane.js' }
next:
  - 'Add the scoped Cloudflare token so pushes and a nightly schedule deploy automatically.'
  - 'Run link and layout checks with Playwright in CI.'
updated: '2026-11-07'
---

## How a build works

1. A push to `main` or a manual run starts the build.
2. `scripts/fetch-data.mjs` pulls my showcased repositories from the GitHub API. Each source is wrapped so that a
   failure is recorded rather than thrown:

```js
async function attempt(source, fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    errors.push({ source, message: String(err.message ?? err) });
    return fallback;
  }
}
```

3. Astro type-checks and builds static HTML. Diagrams are laid out at build time and emitted as SVG, so no layout code
   runs in the browser.
4. The build writes `/status.json`, the same data the home-page diagram is drawn from, and deploys to Cloudflare Pages.
5. In the browser, one small script measures a round trip to `/status.json`, marks the edge node, and reports whether a
   newer build is live.

## Verification

- `astro check` type-checks every build.
- CI fails if the output contains inline scripts, inline styles or `data:` URIs that the CSP would block.
- Every link and anchor on the live site was checked after deployment.
