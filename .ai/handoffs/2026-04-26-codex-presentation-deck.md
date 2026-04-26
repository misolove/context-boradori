# Handoff: Hackathon Presentation Deck

Date: 2026-04-26
Author: Codex

## What was attempted

Created a Korean-first presentation deck for hackathon submission and live demo support.

## What changed

- Added a `presentation/` workspace using the Codex presentation artifact runtime.
- Created a 9-slide deck covering:
  - product promise
  - problem
  - solution
  - product flow
  - Vercel live demo proof
  - why the product helps
  - tech and public-safety posture
  - roadmap
  - closing pitch
- Captured live product screenshots from `https://context-boradori.vercel.app`.
- Generated full-slide PNG previews and a contact sheet for visual QA.
- Fixed the PPT image export path by using PNG data URLs, preventing zero-byte PPT media parts.
- Tightened one roadmap slide title after preview inspection showed text overlap.
- Added `.gitignore` protection for presentation-local runtime folders.

## Files touched

- `.gitignore`
- `.ai/current_state.md`
- `.ai/next_actions.md`
- `.ai/handoffs/2026-04-26-codex-presentation-deck.md`
- `presentation/package.json`
- `presentation/src/deck.mjs`
- `presentation/output/output.pptx`
- `presentation/scratch/assets/*.png`
- `presentation/scratch/previews/*.png`
- `presentation/scratch/reports/quality-report.json`

## Tests/checks run

- `node src/deck.mjs`
- `node /Users/letitbe/.codex/plugins/cache/openai-primary-runtime/presentations/26.423.10653/skills/presentations/scripts/check_presentation_quality.js --workspace /Users/letitbe/context-boradori/presentation --pptx /Users/letitbe/context-boradori/presentation/output/output.pptx --report /Users/letitbe/context-boradori/presentation/scratch/reports/quality-report.json`
- `unzip -l presentation/output/output.pptx 'ppt/media/*'`
- `ffmpeg` contact-sheet generation from exported slide previews
- Manual PNG inspection of `presentation/scratch/previews/contact-sheet.png`
- Manual PNG inspection of `presentation/scratch/previews/slide-05.png`
- Manual PNG inspection of `presentation/scratch/previews/slide-07.png`
- Manual PNG inspection of `presentation/scratch/previews/slide-08.png`

## Known issues

- The deck has not been timed against a live spoken rehearsal yet.
- The backup demo video has not been recorded yet.
- The presentation is Korean-first; English support is present through app/README language switching, but the deck itself is not fully bilingual.

## Recommended next step

Record a short backup demo video: homepage value proposition, sample context load, multi-source merge, north-star map, handoff export/download, then show GitHub README and Vercel URL.
