# Handoff: 2026-04-26 Codex Source Tool UX

## 1. What was attempted

Adjusted the source-tool selector behavior after the user asked whether changing the source AI tool should reset the raw context input.

## 2. What changed

- Changing the source AI tool now clears the previous compression result so stale output is not shown.
- Raw context is preserved on source-tool changes to avoid accidental data loss.
- Added an explicit `입력 비우기` button for intentionally clearing raw context and results.

## 3. Files touched

- `src/components/ContextForm.tsx`
- `.ai/current_state.md`
- `.ai/handoffs/2026-04-26-codex-source-tool-ux.md`

## 4. Tests/checks run

- `npm run lint`
- `npm run build`

## 5. Known issues

- Manual browser QA for the source-tool switch, clear button, copy button, and downloads is still pending.

## 6. Recommended next step

Run a browser click-through pass: load sample context, compress, change source tool, confirm result clears while input remains, then use `입력 비우기`.
