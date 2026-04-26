# Decision: Start With Local Mock Compression

Date: 2026-04-26

## Status

Accepted

## Context

The hackathon needs a visible, reliable MVP quickly. The product story is strongest when the user can paste context, compress it, see structured handoff sections, and export markdown without configuring API keys.

## Decision

Implement the first version as a local browser-only mock compression flow using simple heuristics and redaction. Do not call paid AI APIs or store raw context in a database for the first MVP.

## Consequences

- Demo works without secrets, billing setup, or backend uptime.
- Results are deterministic and limited compared with real LLM summaries.
- Future LLM integration should preserve the same result shape so the UI can evolve without a rewrite.
