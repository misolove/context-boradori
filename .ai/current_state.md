# Current State

Last updated: 2026-10-20
Updated by: Claude Code

## Status

Initial screen-first MVP is implemented, deployed, updated with generated brand identity assets, extended with a multi-source common context flow, refreshed with a more user-friendly workspace UX, enhanced with a visual north-star context map, tightened so the north-star map is visible in the first viewport, supports Korean/English UI switching, has GitHub-style README language links with Korean as the default, and now includes a Claude-polished Korean-first hackathon presentation deck with a final future-expansion slide.

## Confirmed decisions

- Repository name: context-boradori
- Korean product name: 맥락 보라돌이
- Public hackathon repository
- Architecture direction: Vercel + Next.js + local-first context workflow
- Official project memory should live in `.ai/`
- MVP should avoid paid database and external AI dependency
- First deployed demo URL: https://context-boradori.vercel.app
- Brand direction: cute but smart AI context librarian using the "모으다 / 이해하다 / 압축하다 / 연결하다" motif
- Product direction: multiple AI tool sessions should be collected into a shared common context, then exported for the next target AI tool.
- Product direction: the common context should be visually understandable and should keep every follow-up tool aligned to a north star.

## Current implementation

- Next.js App Router app with TypeScript and Tailwind CSS
- Next.js and `eslint-config-next` are pinned to 16.4.2. `npm audit --omit=dev` reports 0 vulnerabilities; the old `overrides.postcss` pin was removed because Next 16.4.2 pins patched postcss 8.5.23 itself.
- Single-page polished purple UI
- Context paste form with project name and source tool selector
- Local mock compression via `generateMockCompression`
- Result panels for summary, decisions, ideas, questions, actions, handoff, and agent exports
- Copy buttons and markdown download buttons
- Basic sensitive text redaction for common API key/token/database URL patterns
- Vercel project connected to `misolove/context-boradori`
- Brand images added under `public/brand/`
- UI palette and copy aligned with the generated brand boards
- Changing the source AI tool clears stale raw context and compression results so pasted context does not accidentally stay attached to the wrong tool.
- Users can add compressed context pieces from multiple source tools into a common context tray.
- The tray can be merged into a common handoff for a selected target AI tool.
- Demo sample button can add three parallel context pieces from ChatGPT, Codex, and Claude.
- Context pieces and the editable project north star are stored in browser `localStorage` for demo continuity; no server or GitHub DB is used.
- Pencil MCP design-system references were used to reshape the main UI around a clearer workspace header, compact stats, source/tray panels, and tabbed result previews.
- Merged outputs now include a `northStar` field.
- The UI shows a visual common-context map near the top of the workspace, connecting source tools, the north star, key decisions/questions/actions, and the target AI tool.
- Users can edit the project north star, and the same sentence is used in the map plus handoff/agent exports.
- Users can toggle the main demo UI between Korean and English; `?lang=en` opens directly in English for judges.
- English mode includes translated hero/workspace/map/result UI, English sample contexts, English mock fallback text, and English handoff section headings.
- GitHub README is Korean-first by default, with `README.en.md` available through a top language link for international judges/users.
- GitHub README/README.en now explain the same future-expansion story as the final presentation slide: handoff quality, memory/common-context map, integrations, and trust/safety.
- English brand boards are available in `public/brand/`, and the English app/README views use the English image assets while Korean remains the default.
- Browser QA covered Korean/English sample loading, multi-source merge, source-tool clearing, copy, markdown downloads, localStorage persistence, and desktop/mobile first-viewport positioning.
- Mock compression heuristics now avoid treating `Next.js` as a next action, avoid classifying proposal-prefixed lines as confirmed decisions, and remove English fallback text from merged handoffs.
- Mobile layout is tightened so the common-context map starts inside a 390x844 first viewport and appears before the editable north-star textarea.
- Hackathon presentation materials are available under `presentation/`.
- The current PPTX is `presentation/output/output.pptx`, synced from the Claude-polished deck at `/Users/letitbe/Downloads/맥락보라돌이_해커톤_데모덱.pptx`.
- The current deck has 10 slides covering problem, solution, product flow, live demo proof, usefulness, tech/safety, roadmap, closing, and future expansion.
- Presentation previews and a contact sheet remain available under `presentation/scratch/previews/`, but they were generated before the Claude-polished PPTX sync.
- The Claude-polished PPTX package was extended with a final `08 · EXPANSION` slide covering handoff quality, memory/map improvements, and integrations.
- The PPTX package was verified with `unzip -t`; it has 10 slides, 31 media files, 0 zero-byte media files, and no compressed data errors.
- Backup demo video with Korean/English hard subtitles was generated at `/Users/letitbe/Desktop/context-boradori-demo-subtitled.mp4`.
- A Mermaid session map (`src/components/SessionMap.tsx`, `src/lib/sessionMap.ts`) appears below the common tray once sessions exist. Sessions are grouped by source tool in collection order and all point to a shared-context hub that names the target tool.
- Clicking a session node (or a tray title) opens a quick peek with that session's decisions, questions, and actions; "전체 결과 보기" scrolls to the per-session result panel, which is now titled with the session name.
- Tray cards show a session gist (first concrete decision/action/idea/question) and counts instead of the repeated summary boilerplate.
- The session map's Mermaid code can be copied for GitHub/Obsidian. Mermaid 12.2.0 is loaded with a dynamic import, so it is not part of the initial page bundle.

## Local secure usage

- `npm run local` builds for production and serves only on `127.0.0.1:3107`, so other devices on the network cannot reach it.
- `next.config.ts` sends a Content Security Policy (`default-src 'self'`, `connect-src 'self'`, `img-src 'self' data: blob:`, `form-action 'none'`, `frame-ancestors 'none'`, `object-src 'none'`) plus `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and a restrictive `Permissions-Policy`. Dev mode adds `'unsafe-eval'` and `ws:` for HMR.
- The same headers apply to the Vercel demo. Vercel preview deployments may log CSP errors for the Vercel toolbar script; production is unaffected.
- README/README.en have a local secure usage guide: run locally for real context, keep exports out of this public repo, and the CSP limits.

## Not started / future

- Real LLM compression API
- Vercel AI SDK streaming
- IndexedDB persistence
- Stronger conflict detection between parallel AI tool sessions
- Reusable project doctrine built from the editable north star
- GitHub PR export
- MCP integration
- Product-flow screenshots for README
- Updated rendered slide previews for the Claude-polished presentation deck
