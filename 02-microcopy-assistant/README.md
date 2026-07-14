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

## Stack

React 19 + TypeScript (strict) · Vite · Tailwind (Material Design 3 tokens) ·
Vitest + Testing Library. Node ≥ 22.

## Commands

- `npm run dev`         — run locally
- `npm test`            — client tests
- `npm run test:server` — runtime-context tests (`server/`)
- `npm run lint`        — lint
- `npm run typecheck`   — type checking

## Status

🚧 Front end built, real API integration pending. The full flow works end to end
against a **stub AI client** (`src/lib/ai.ts`): form → runtime-context assembly
(`server/context.ts`) → 3 validated variants rendered as cards. What's left is
swapping the stub for a real Anthropic API call — that lands in the
build-with-the-API phase.
