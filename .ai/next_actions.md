# Next Actions

## P0

- [x] Create Next.js app
- [x] Add polished landing page
- [x] Add context paste form
- [x] Add source tool selector
- [x] Add mock compression
- [x] Add result panels
- [x] Add copy buttons
- [x] Add markdown download buttons
- [x] Deploy first Vercel demo
- [x] Connect GitHub repo to Vercel project
- [x] Add brand identity assets to app and README

## P1

- [x] Run browser click-through QA for sample context, multi-source merge, copy, and downloads
- [x] Improve main workspace UX with Pencil MCP design-system references
- [x] Add visual common-context map with north-star alignment
- [x] Add editable north-star goal input and include it in exports
- [x] Add Korean/English language toggle for demo UI
- [x] Add GitHub-style README language switch with `README.en.md`
- [x] Add English brand image assets for English app/README views
- [x] Tighten mobile first viewport so the common-context map appears earlier
- [x] Create Korean-first hackathon presentation deck
- [x] Sync Claude-polished hackathon presentation deck into repo output
- [x] Add future-expansion slide to hackathon presentation deck
- [x] Reflect future-expansion roadmap in Korean/English README
- [x] Upgrade Next.js to 16.4.2 to clear the `npm audit --omit=dev` advisories
- [ ] Recheck the dev-only `npm audit` highs (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`) once a fixed release exists
- [ ] Add local IndexedDB storage
- [x] Broaden secret redaction (GitHub, AWS, Slack, JWT, passwords, full private key blocks) with tests
- [ ] Review redaction again before any future LLM call (e.g. credentials in non-postgres URLs like `mysql://user:pass@`)
- [x] Add sample demo context variants
- [ ] Add product-flow screenshots to README
- [x] Record backup demo video for submission
- [ ] Regenerate slide preview PNGs for the Claude-polished deck if preview parity is needed

## P2

- [ ] Add Vercel AI SDK compression route
- [ ] Add streaming result UI
- [ ] Add GitHub PR export later
- [ ] Add MCP/CLI handoff integration
- [ ] Add conflict detection and resolution UI for competing AI tool suggestions
- [ ] Turn the editable north star into a reusable project doctrine

## Session map follow-ups

- [x] Add a Mermaid session map with clickable session nodes and a quick peek
- [ ] Decide whether `common-handoff.md` should embed the session map Mermaid block
- [ ] Let users rename sessions so map labels stay meaningful beyond the auto gist
- [x] Upgrade Next.js to 16.4.2+ to clear the existing `npm audit --omit=dev` advisories

## Session sharing follow-ups

- [x] Share tray sessions across devices through the private memory repo
- [ ] Decide how deletes should propagate (today a tray delete is local only)
- [x] Keep a stable, editable shared folder (default `context-boradori`) instead of slugging the current project name
- [x] Add automated tests, a `format` version, and a skipped-file count to session sharing
- [ ] Decide whether the shared folder should follow a project picker once projects are more than one name field
- [ ] Consider automatic collection of local AI tool sessions (Claude Code, Codex) as a separate, opt-in feature

## Local secure usage

- [x] Add `npm run local` bound to 127.0.0.1
- [x] Add CSP and security headers
- [x] Document local secure usage in README/README.en
- [ ] Consider hash-based `script-src` to drop `'unsafe-inline'` for scripts
- [ ] Tag reviewed releases so local installs can pin to a tag
