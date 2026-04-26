# Decision: Multi-Source Common Context Flow

## Status

Accepted

## Context

The original product intent is not only to compress one pasted AI conversation. The user wants to work across ChatGPT, Codex, Claude, Gemini, and similar tools, then collect those parallel tool contexts into one shared project memory that can be handed to the next tool.

## Decision

The MVP should include a multi-source context tray:

- Each pasted source context can be compressed locally and added as a context piece.
- Multiple context pieces can be merged into a common project handoff.
- The user can choose the target AI tool for the merged handoff.
- GitHub should not be used as a raw context database for the public hackathon repo.
- Browser-local storage is acceptable for demo continuity as long as no server or public repo persistence is involved.

## Consequences

- The product story becomes "AI context hub" rather than a single-session summarizer.
- The mock compression logic remains local and deterministic.
- Future work should add conflict detection, stronger redaction, and a more durable local storage layer such as IndexedDB.
