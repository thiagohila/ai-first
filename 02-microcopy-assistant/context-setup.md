# Microcopy Assistant — Context Setup

How the app assembles the context it sends to the model on every request.

This is the **runtime context** (what the product sends the LLM at request time),
which is distinct from `CLAUDE.md` (context for the agent that *builds* the app).
Both are context engineering; this file documents the former.

---

## The shape of a request

```
system   → role, task, input shape, rules, output contract   (static)
messages → user(example 1)  / assistant(JSON 1)
           user(example 2)  / assistant(JSON 2)               (static — the bar)
           user(example 3)  / assistant(JSON 3)
           user(real request)                                 (the only part that changes)
```

Note: in Claude's API the **system prompt is a top-level `system` parameter**, not a
message. The `messages` array only holds `user`/`assistant` turns — which is exactly
how few-shot works here: prior `assistant` turns show the model "this is how I respond."

---

## System prompt (static)

```
You are a UX writing (microcopy) specialist. Your job is to generate short,
usable text variants for interface elements.

You will receive:
- element: the UI element type (e.g. button, empty state, error message)
- context: one sentence about the product/situation
- tone: the desired tone (e.g. friendly, formal, direct)

Rules:
- Generate exactly 3 variants.
- Respect the requested tone and the element type (buttons = short and
  actionable; error messages = clear and never blame the user; empty states =
  guide the next action).
- Write in English.
- Do not invent names, numbers, or facts that aren't in the context.
- For each variant, add a one-line rationale.

Respond with valid JSON only — no markdown, no text before or after — in this
exact format:
{ "variants": [ { "text": "string", "rationale": "string" } ] }
```

---

## Few-shot examples (static)

Passed as alternating `user` → `assistant` turns. Chosen for **diversity**
(different element types and tones) so the model generalizes.

### Example 1 — button, friendly
**user**
```
element: button
context: a budgeting app; this button saves a new expense the user just entered
tone: friendly
```
**assistant**
```json
{ "variants": [
  { "text": "Save expense", "rationale": "Plain and action-first; the user knows exactly what happens." },
  { "text": "Add it", "rationale": "Short and casual, matching a friendly tone." },
  { "text": "Done — save", "rationale": "Confirms completion and the action in two beats." }
] }
```

### Example 2 — error message, clear and reassuring
**user**
```
element: error message
context: a login form; the password the user entered is incorrect
tone: clear and reassuring
```
**assistant**
```json
{ "variants": [
  { "text": "That password doesn't match. Want to try again?", "rationale": "States the issue without blaming; offers a path forward." },
  { "text": "Hmm, that didn't work — double-check your password.", "rationale": "Non-accusatory and actionable." },
  { "text": "Incorrect password. Reset it if you've forgotten.", "rationale": "Clear, with an escape hatch for the stuck user." }
] }
```

### Example 3 — empty state, encouraging
**user**
```
element: empty state
context: a task manager; the user has no tasks yet
tone: encouraging
```
**assistant**
```json
{ "variants": [
  { "text": "No tasks yet — add your first one to get started.", "rationale": "Orients to the next action with positive framing." },
  { "text": "Your list is clear. Ready to add something?", "rationale": "Frames the empty state as a fresh start and invites action." },
  { "text": "Nothing here yet. Tap + to create a task.", "rationale": "Names the concrete next step and the UI affordance." }
] }
```

---

## The dynamic part (changes per request)

Only the final `user` message changes. It's assembled from the three inputs:

```
element: {element}
context: {context}
tone: {tone}
```

---

## Engineering decisions (the "why")

- **Few-shot as alternating turns, not prose.** Showing real `assistant` outputs
  teaches the format and quality bar far better than describing them in text.
- **Diversity over quantity.** Three examples spanning element types and tones,
  not three of the same — so the model generalizes. More examples would add cost
  for diminishing returns.
- **Examples are the quality bar.** The model imitates them, so they must be
  exemplary. Mediocre examples produce mediocre output.
- **Examples encode hard-to-state rules.** The error example demonstrates
  "never blame the user," which is easier to show than to specify.
- **Format reinforcement.** Every example emits the exact JSON contract,
  reinforcing the output shape on top of the system prompt's instruction.
- **Lean system prompt.** Rich guidance lives in the examples (the "show" layer),
  keeping the system prompt short — context is budget.
- **Static vs dynamic split.** System + few-shot are identical on every call;
  only the final user message changes. This static prefix is a natural candidate
  for prompt caching later (cheaper, faster) — a Fase 4 concern.
```
