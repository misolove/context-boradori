# Current State

Last updated: 2026-04-26
Updated by: Codex

## Status

Initial screen-first MVP is implemented and deployed.

## Confirmed decisions

- Repository name: context-boradori
- Korean product name: 맥락 보라돌이
- Public hackathon repository
- Architecture direction: Vercel + Next.js + local-first context workflow
- Official project memory should live in `.ai/`
- MVP should avoid paid database and external AI dependency
- First deployed demo URL: https://context-boradori.vercel.app

## Current implementation

- Next.js App Router app with TypeScript and Tailwind CSS
- Single-page polished purple UI
- Context paste form with project name and source tool selector
- Local mock compression via `generateMockCompression`
- Result panels for summary, decisions, ideas, questions, actions, handoff, and agent exports
- Copy buttons and markdown download buttons
- Basic sensitive text redaction for common API key/token/database URL patterns
- Vercel project connected to `misolove/context-boradori`

## Not started / future

- Real LLM compression API
- Vercel AI SDK streaming
- IndexedDB persistence
- GitHub PR export
- MCP integration
- Browser QA for clipboard/download behavior across browsers
