# Current State

Last updated: 2026-10-22
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
- Sensitive text redaction (`src/lib/security.ts`) for OpenAI-style keys, `*_API_KEY/SECRET/TOKEN/DATABASE_URL=` assignments, postgres URLs, Bearer tokens, private key blocks (through the END line), GitHub tokens (`ghp_`/`gho_`/`ghu_`/`ghs_`/`ghr_`, `github_pat_`), AWS access key ids (`AKIA`/`ASIA`), Slack tokens (`xox[abpr]-`), JWTs, and `password=` / `passwd:` assignments. A `password:` value is redacted only when quoted or a single ASCII word ending the line, so prose stays.
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
- The current PPTX is `presentation/output/output.pptx`, synced from the Claude-polished deck `맥락보라돌이_해커톤_데모덱.pptx` (a local copy kept outside the repo).
- The current deck has 10 slides covering problem, solution, product flow, live demo proof, usefulness, tech/safety, roadmap, closing, and future expansion.
- Presentation previews and a contact sheet remain available under `presentation/scratch/previews/`, but they were generated before the Claude-polished PPTX sync.
- The Claude-polished PPTX package was extended with a final `08 · EXPANSION` slide covering handoff quality, memory/map improvements, and integrations.
- The PPTX package was verified with `unzip -t`; it has 10 slides, 31 media files, 0 zero-byte media files, and no compressed data errors.
- Backup demo video with Korean/English hard subtitles was generated as `context-boradori-demo-subtitled.mp4` (kept outside the repo).
- A Mermaid session map (`src/components/SessionMap.tsx`, `src/lib/sessionMap.ts`) appears below the common tray once sessions exist. Sessions are grouped by source tool in collection order and all point to a shared-context hub that names the target tool.
- Clicking a session node (or a tray title) opens a quick peek with that session's decisions, questions, and actions; "전체 결과 보기" scrolls to the per-session result panel, which is now titled with the session name.
- Tray cards show a session gist (first concrete decision/action/idea/question) and counts instead of the repeated summary boilerplate.
- The session map's Mermaid code can be copied for GitHub/Obsidian. Mermaid 12.2.0 is loaded with a dynamic import, so it is not part of the initial page bundle.

## Local secure usage

- `npm run local` builds for production and serves only on `127.0.0.1:3107`, so other devices on the network cannot reach it.
- `next.config.ts` sends a Content Security Policy (`default-src 'self'`, `connect-src 'self'`, `img-src 'self' data: blob:`, `form-action 'none'`, `frame-ancestors 'none'`, `object-src 'none'`) plus `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and a restrictive `Permissions-Policy`. Dev mode adds `'unsafe-eval'` and `ws:` for HMR.
- The same headers apply to the Vercel demo. Vercel preview deployments may log CSP errors for the Vercel toolbar script; production is unaffected.
- README/README.en have a local secure usage guide: run locally for real context, keep exports out of this public repo, and the CSP limits.

## Sharing sessions across devices

- Tray sessions can be shared through the private `context-boradori-memory` repository. Each session is one markdown file at `projects/<folder-slug>/sessions/<created>-<tool>-<id8>.md` with JSON-valued frontmatter and core sections wrapped in id-salted markers; exports are rebuilt on import.
- Session files carry `format: 1`. A file without `format` is read as version 1; any other value is skipped so an old app never misreads a newer file.
- The shared folder is a stored, editable slug in the share box (localStorage `context-boradori-share-folder-v1`, default `context-boradori`), not the project name. The language toggle swaps `맥락 보라돌이` ↔ `Context Boradori` but no longer changes the folder.
- `src/app/api/sessions/route.ts` (local only): GET reports whether sharing is on and the device name; POST takes `{ projectName, folder, pieces }`, rejects a `folder` that is not already a slug, writes tray pieces the folder does not have yet (create-only), and returns every session in the folder plus `skipped` (unreadable `.md` files, named in the server log). The tray shows "파일 N개를 읽지 못했습니다" / "Could not read N files". It requires the `x-boradori-sync` header, a localhost Host, and a same-origin Origin.
- `.boradori/config.json` (gitignored) holds `memoryWorkspacePath` and `deviceName`. Without it, sharing is off and the UI hides the controls (the Vercel demo answers 403).
- `npm run sync` (`scripts/sync-sessions.mjs`) commits only `projects/*/sessions/` changes in the private repo, pulls with rebase, and pushes.
- Pieces carry an optional `device` shown in the tray, session map, and quick peek. The tray limit went from 12 to 40.

## Tests

- `npm test` runs vitest 4.1.12 (`vitest.config.mts`, `src/**/*.test.ts`). vitest 5 was skipped because it drops `@types/node` 20 from its peer range.
- `src/lib/sessionFiles.test.ts`: exact round trip of all 10 result fields (Korean, English, fake-marker pieces), pasted markers, missing/changed markers, CRLF, format version, `projectSlug` and folder validation.
- `src/lib/sessionMap.test.ts`: Mermaid label escaping for quotes, `#`, `%`, `<`, `>`, backticks, `%%{init}%%`, newlines, and hostile tool names.
- `src/lib/security.test.ts`: redaction hits and near-misses.

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
