# Handoff: 2026-10-20 Claude Code Local Secure Usage

## 1. What was attempted

The repository stays public with code and docs, and real work context should only be used in a local copy. This session hardened that local copy and documented how to run it.

## 2. What changed

- Added `npm run local`: `next build && next start -H 127.0.0.1 -p 3107`.
- Added security headers in `next.config.ts`: a Content Security Policy that keeps every request on the page's own origin, plus `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, and `Permissions-Policy`. Dev mode relaxes the CSP for eval and the HMR websocket.
- Added a Korean/English "local secure usage" guide to the READMEs and a pointer from the demo section.
- Built on `chore/next-16.4.2` (Next.js 16.4.2, `npm audit --omit=dev` clean).

## 3. Files touched

- `next.config.ts`
- `package.json`
- `README.md`, `README.en.md`
- `.ai/current_state.md`, `.ai/next_actions.md`
- `.ai/handoffs/2026-10-20-claude-local-secure-usage.md`

## 4. Tests/checks run

- `npx tsc --noEmit`, `npm run lint`, `npm run local` (production build)
- `lsof` shows the server listening only on `127.0.0.1:3107`; requests to the LAN address fail
- `curl -I` shows all five headers
- Browser on `http://127.0.0.1:3107`: parallel samples, merge, markdown download, language toggle, and brand images work with no CSP violations
- Exfiltration check from the page: `fetch`, an external `Image`, and `navigator.sendBeacon` to an outside host are all blocked by CSP
- Session map (PR #1) combined with these headers in a scratch worktree: the Mermaid map renders, styles and selection highlight apply, and there are no CSP violations

## 5. Known issues

- `script-src` keeps `'unsafe-inline'` because Next.js bootstraps with inline scripts; CSP also cannot block exfiltration by navigation.
- Vercel preview deployments may log CSP errors for the Vercel toolbar script.
- This branch and PR #1 (session map) both touch `package.json`, `package-lock.json`, and `.ai/` notes, so whichever merges second needs a conflict fix.

## 6. Recommended next step

Merge this and PR #1, then tag a reviewed release so local installs can pin to it.
