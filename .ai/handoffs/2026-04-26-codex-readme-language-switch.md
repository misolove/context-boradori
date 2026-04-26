# Handoff: 2026-04-26 Codex README Language Switch

## 1. What was attempted

Changed the GitHub-facing documentation from a single long bilingual README into a GitHub-native language switch pattern.

## 2. What changed

- Kept `README.md` as the Korean-first default page.
- Added `README.en.md` as a separate English page.
- Added top language links to both README files.
- Removed the inline English section from the Korean README so clicking English feels like a natural page switch on GitHub.
- Updated `.ai/current_state.md` and `.ai/next_actions.md`.

## 3. Files touched

- `README.md`
- `README.en.md`
- `.ai/current_state.md`
- `.ai/next_actions.md`
- `.ai/handoffs/2026-04-26-codex-readme-language-switch.md`

## 4. Tests/checks run

- `git diff --check`

## 5. Known issues

- Product-flow screenshots are still pending.
- Browser click-through QA for copy/download remains pending.

## 6. Recommended next step

Verify both README files render correctly on GitHub after push.
