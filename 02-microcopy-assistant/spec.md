# Microcopy Assistant — Spec v0

**Problem:** Writing good microcopy — clear and in the right tone — is slow and
inconsistent. Devs and PMs either lose time or ship generic text.

**User:** Anyone building UI — frontend dev, designer, PM — who needs quick,
decent copy.

**Core flow:** pick the element type → describe the context in one sentence →
choose the tone → get 3 variants with rationale → copy the one that fits.

**Acceptance criteria (definition of done):**
- Can generate variants for at least: button, empty state, error message.
- Always returns 3 variants, each with text + rationale.
- Can copy a variant with one click.
- Network/model errors never break the screen (an error state is shown).

**Non-goals (v0):** no login/accounts, no saved history, no multiple languages
(English only), no trained brand voice. All of that is later.

**Stack:** React + TypeScript + Vite, Tailwind, Anthropic SDK. Tests: Vitest.
Lint/format: ESLint + Prettier.

**Model output contract:**
```json
{ "variants": [ { "text": "string", "rationale": "string" } ] }
```
