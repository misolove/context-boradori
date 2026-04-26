# Current State

Last updated: 2026-04-26
Updated by: Codex

## Status

Initial screen-first MVP is implemented, deployed, updated with generated brand identity assets, extended with a multi-source common context flow, refreshed with a more user-friendly workspace UX, and enhanced with a visual north-star context map.

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
- Single-page polished purple UI
- Context paste form with project name and source tool selector
- Local mock compression via `generateMockCompression`
- Result panels for summary, decisions, ideas, questions, actions, handoff, and agent exports
- Copy buttons and markdown download buttons
- Basic sensitive text redaction for common API key/token/database URL patterns
- Vercel project connected to `misolove/context-boradori`
- Brand images added under `public/brand/`
- UI palette and copy aligned with the generated brand boards
- Changing the source AI tool clears stale compression results but preserves raw context; users can explicitly clear input with `입력 비우기`.
- Users can add compressed context pieces from multiple source tools into a common context tray.
- The tray can be merged into a common handoff for a selected target AI tool.
- Demo sample button can add three parallel context pieces from ChatGPT, Codex, and Claude.
- Context pieces are stored in browser `localStorage` for demo continuity; no server or GitHub DB is used.
- Pencil MCP design-system references were used to reshape the main UI around a clearer workspace header, compact stats, source/tray panels, and tabbed result previews.
- Merged outputs now include a `northStar` field.
- The UI shows a visual common-context map connecting source tools, the north star, key decisions/questions/actions, and the target AI tool.

## Not started / future

- Real LLM compression API
- Vercel AI SDK streaming
- IndexedDB persistence
- Stronger conflict detection between parallel AI tool sessions
- Editable north-star goal input
- GitHub PR export
- MCP integration
- Browser QA for clipboard/download behavior across browsers
- Product-flow screenshots for README
