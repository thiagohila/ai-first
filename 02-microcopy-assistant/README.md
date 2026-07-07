# 02 — Microcopy Assistant

A small AI-first tool that generates usable UX microcopy. Describe a UI element,
the product context, and the tone you want — the model returns 3 copy variants,
each with a one-line rationale.

This experiment is my vehicle for **context engineering**: the craft of designing
everything that goes into the model's context window so an LLM behaves like a
reliable UI component, not a chat box.

## What it demonstrates

- A deliberate **runtime context** — a lean system prompt plus diverse few-shot
  examples assembled as alternating turns (see `context-setup.md`).
- The **structured output → UI** pattern: text in, strict JSON out, rendered as UI.
- The split between **build-time context** (`CLAUDE.md`, for the agent that builds
  the app) and **runtime context** (`context-setup.md`, what the app sends the model).

## Notes

- [The AI skill nobody puts on their resume](./notes/post-02-context-engineering.md)

## Docs

- `spec.md` — one-page spec and the output contract (source of truth)
- `context-setup.md` — the runtime context design (system prompt + few-shot + assembly + decisions)
- `CLAUDE.md` — context for the agent that builds the app

## Status

🛠️ Designed, not yet built. The spec and the full context strategy are done;
the implementation (React + Vite + the API integration) comes later, in the
build-with-the-API phase.
