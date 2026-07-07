# Post — Experiment 01: I stopped treating LLMs like chatbots

*Build-in-public draft. Adapt to your voice and channel before publishing.*

For years I used AI to write code faster. Lately I started building software that
uses AI *inside* it — and that's a different game.

The pattern that unlocked it for me: stop treating the model as a chat box, start
treating it as a function. Text in → structured JSON out → rendered as UI.

A chatbot hands you a wall of text. A function hands you data you can trust and
render as components. That single shift turns an LLM from a toy into a reliable
piece of UI.

The mechanics are familiar — it's a `fetch` you've done a thousand times. Only
three things are actually new:

1. **Message structure** — the conversation is a list of roles (system / user / assistant).
2. **Forcing reliable output** — the prompt defines an exact JSON contract and says
   "respond with JSON only," so the result is parseable, not chatty.
3. **Safe parsing** — the output is non-deterministic, so you parse defensively and
   never let the UI break.

I built a small demo to prove it to myself: paste any text, get back sentiment,
topics, and action items rendered as UI. Code's in my repo.

The kicker — this same skeleton (text in, JSON out, render) sits under most AI
features you'll ever build: classify, extract, summarize, tag, route.

Learning this in public. More soon.
