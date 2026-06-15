# Microcopy Assistant

App that generates microcopy (UX writing) variants via an LLM.
Spec and output contract: see `spec.md` (source of truth).
Runtime context design (system prompt + few-shot): see `context-setup.md`.

## Stack
React + TypeScript (strict) · Vite · Tailwind · Anthropic SDK
Tests: Vitest · Lint/format: ESLint + Prettier

## Commands
- `npm run dev`       — run locally
- `npm test`          — tests
- `npm run lint`      — lint
- `npm run typecheck` — type checking

## Structure
- `src/components/`   — UI
- `src/lib/ai.ts`     — API client and the model call
- `src/lib/schema.ts` — the output contract (single source)

## Conventions
- Functional components + hooks. No inline styles; Tailwind only.
- Model output is ALWAYS parsed inside try/catch (it's non-deterministic).
- The contract in `schema.ts` is the truth: prompt and UI derive from it.

## Rules for the agent
- Keep tests passing; run `npm test` before saying "done".
- Small, descriptive commits.
- Don't add a new dependency without asking.
- Respect the spec's non-goals (no login, i18n, history in v0).
