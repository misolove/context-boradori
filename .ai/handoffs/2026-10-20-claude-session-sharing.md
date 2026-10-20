# Handoff: 2026-10-20 Claude Code Session Sharing

## 1. What was attempted

Let sessions collected in the local app on one device be opened on other devices, using the private `misolove/context-boradori-memory` repository, while the public repo keeps only code and docs. Decisions from the user: reuse the existing memory repo, share tray sessions only, sync with an in-app button plus `npm run sync`, and store plain markdown.

## 2. What changed

- `src/lib/sessionFiles.ts`: session file format (serialize/parse), project slug, file names. Section markers include the first 8 characters of the session id so pasted text cannot fake one.
- `src/lib/server/boradoriConfig.ts`: reads `.boradori/config.json`.
- `src/app/api/sessions/route.ts`: local-only GET (status) and POST (create-only write, then return all sessions in the folder).
- `src/components/ContextForm.tsx`: "기기 간 공유" box with the sync button, union merge of tray and folder (folder copy wins), tray limit 40, device label on tray cards.
- `src/components/SessionMap.tsx`, `src/lib/sessionMap.ts`: device name in node labels and quick peek.
- `scripts/sync-sessions.mjs` + `npm run sync`.
- `.gitignore`: `.boradori/`.
- README/README.en: "기기 간 세션 공유 / Sharing Sessions Across Devices".

## 3. Files touched

See the list above plus `src/lib/compression.ts` (optional `device` on `ContextPiece`), `src/lib/i18n.ts`, `package.json`, `.ai/current_state.md`, `.ai/next_actions.md`.

## 4. Tests/checks run

- `npx tsc --noEmit`, `npm run lint`, `npm run local` (production build)
- API access checks with curl: no header, foreign Host, and foreign Origin all get 403; a `../../etc` project name stays inside the workspace as `projects/etc`
- Two-device run against a scratch bare clone of the memory repo, with device A on `http://127.0.0.1:3107` and device B on `http://localhost:3107` (separate browser storage):
  - A: sync → 4 saved; `npm run sync` sends 4. B: `npm run sync` receives 4; app sync → own pieces saved, 4 loaded; device labels and session map show both devices
  - B → A in the other direction; a second sync is a no-op
- Round trip: all 10 result fields of 4 sessions came back identical, including a session whose text contains fake section markers, quotes, `#`, tags, and `##` lines
- Broken marker files are skipped and do not blank the tray's copy

## 5. Known issues

- Deletes are local only; removing a shared session means deleting its file and running `npm run sync`.
- The folder follows the current project name, and the app swaps `맥락 보라돌이` ↔ `Context Boradori` when the language toggles, which changes the folder.
- A broken file stays broken in the repo until someone deletes it and syncs again.

## 6. Recommended next step

Merge, then on each device clone the memory repo, add `.boradori/config.json`, and run `npm run local`.
