# AGENTS.md

## Project

context-boradori is an AI context hub for collecting, compressing, organizing, and handing off project context across ChatGPT, Claude, Codex, Gemini, and other AI tools.

## Product name

맥락 보라돌이

## Core idea

The official memory of this project lives in the `.ai/` directory.

## Required reading before work

- `.ai/project_brief.md`
- `.ai/current_state.md`
- `.ai/next_actions.md`
- latest file in `.ai/handoffs/`
- relevant ADRs in `.ai/decisions/`

## Working rules

- Do not invent decisions.
- Separate confirmed decisions from ideas.
- Never store secrets, API keys, credentials, tokens, private URLs, or private financial information.
- Prefer small, reviewable changes.
- After meaningful work, update:
  - `.ai/current_state.md`
  - `.ai/next_actions.md`
  - a new handoff file under `.ai/handoffs/`

## MVP priorities

1. Polished landing page
2. Context paste form
3. Mock compression result
4. Markdown export
5. Public-safe repository hygiene

## Handoff format

Each session should leave:

1. What was attempted
2. What changed
3. Files touched
4. Tests/checks run
5. Known issues
6. Recommended next step
