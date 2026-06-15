# 01 — Extrator

A demo of the single most transferable pattern in LLM apps:
**structured output → UI.** Treat the model as a function — text in, JSON out,
rendered as interface.

Paste any text (a meeting note, an email, a review) and the model returns
structured JSON — sentiment, summary, topics, action items — which the UI
renders as components instead of a wall of chat text.

## What this demonstrates

The three things that are actually new when you put an LLM in an app:

1. **Message structure** — the request is just a `fetch` to the messages API.
2. **Forcing reliable output** — the prompt defines an exact JSON contract and
   says "respond with JSON only", so the result is parseable, not chatty.
3. **Safe parsing** — the response is read by block type and parsed inside a
   `try/catch`, because model output is non-deterministic. The UI never breaks.

## Running it

⚠️ This was built for the **Claude.ai artifacts runtime**, where the API key is
injected automatically. It will **not** run as-is in a local project — that needs
a React setup and its own way to authenticate to the API.

Right now this lives here as a **record of the pattern**, not a runnable app.
A properly runnable version (with a real API integration) is planned later.

## Status

🅿️ Parked learning experiment. The pattern it teaches is reused across most
AI features: classify, extract, summarize, tag, route.
