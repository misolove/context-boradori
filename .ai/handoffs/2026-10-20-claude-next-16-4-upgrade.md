# Handoff: 2026-10-20 Claude Code Next.js 16.4.2 Upgrade

## 1. What was attempted

Cleared the production `npm audit` advisories that were already on `main`: a critical Next.js entry (Server Components DoS, App Router middleware/proxy bypass, and others) plus high sharp, postcss, nanoid, and source-map-js entries. This was split out of the session map work so that PR stays reviewable.

## 2. What changed

- `next` 16.2.4 → 16.4.2 and `eslint-config-next` 16.2.4 → 16.4.2, still exact-pinned.
- Removed `overrides.postcss: 8.5.10`. Next 16.4.2 pins postcss 8.5.23, the first patched release, and the old override would have forced it back to a vulnerable version. postcss now dedupes to 8.5.23 for both Next and `@tailwindcss/postcss`.
- Ran a non-forced `npm audit fix` (lockfile only): nanoid 3.3.20, source-map-js 1.2.2, baseline-browser-mapping 2.11.30, plus in-range dev tooling bumps (Babel 7.29.x, browserslist, js-yaml, brace-expansion).
- Next also brings sharp 0.35.5 (libvips 1.3.4), which `next/image` uses for the brand images.

## 3. Files touched

- `package.json`, `package-lock.json`
- `.ai/current_state.md`, `.ai/next_actions.md`

## 4. Tests/checks run

- `npm audit --omit=dev`: 0 vulnerabilities (before: 1 critical, 3 high, 1 moderate)
- `npx tsc --noEmit`, `npm run lint`, `npm run build` (Next 16.4.2 Turbopack, `/` still static)
- Dev server: Korean page loads, parallel sample → merge works at 1280px, English `?lang=en` at 375px has no horizontal overflow, no console errors, no server errors
- `next start`: both brand images are served through `/_next/image` with 200 `image/png`

## 5. Known issues

- Full `npm audit` (dev included) still lists 5 high entries along `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. These are lint-time only. npm's suggested fix is a downgrade to `eslint-config-next@14.2.35`, so they were left alone.
- Node 26 prints `DEP0205 module.register() is deprecated` during `next build`/`next dev`. This is only a warning.
- `feature/session-map` has an open next action, "Upgrade Next.js to 16.4.2+". Tick it when that branch merges with this one.

## 6. Recommended next step

Merge this branch into `main` (Vercel redeploys from `main`), then rebase `feature/session-map` on it and re-run `npm audit --omit=dev` there to confirm Mermaid 12.2.0 adds nothing.
