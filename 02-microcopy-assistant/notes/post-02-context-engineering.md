# Post — Experiment 02: The AI skill nobody puts on their resume

*Build-in-public draft. Adapt to your voice and channel before publishing.*

Everyone talks about prompt engineering. The part that actually decides whether
your AI feature works is **context engineering** — and almost no one names it.

Here's the shift that made it click for me, as a frontend dev: context engineering
is to LLM apps what state management is to the frontend. The context window is the
state the model renders from. Stale state → stale output. Too much state → noise.
Wrong state → wrong render.

Five principles I'm working from:

1. **Context is budget** — include the minimum relevant; irrelevant tokens dilute attention.
2. **Right info, right time** — load on demand, not everything always.
3. **Show > tell** — examples teach quality and format better than rules.
4. **Structure + contract** — organize the context, and specify the output format.
5. **Layers** — global → project → task.

The one that surprised me most: examples beat instructions. I needed the model to
never write error messages that blame the user. Instead of describing that rule, I
showed one good example. The model imitates — so the example *is* the rule.

One distinction worth making: **build-time context** (the file that guides the agent
building your app) vs **runtime context** (what your app sends the model on every
request). Different moments, same craft.

I applied all of this designing the context for a small microcopy generator —
a lean system prompt plus few-shot examples assembled as alternating turns.
Write-up and the full set of decisions are in my repo.

Building in public.
