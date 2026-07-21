import { toGeminiContents } from './geminiContext'
import { UpstreamError } from './errors'
import type { MicrocopyClient } from './app'

/**
 * Default Gemini model — configurable via the `model` arg (server/index.ts
 * passes GEMINI_MODEL). The `-latest` alias tracks the current flash-lite model
 * so it doesn't rot: pinned ids get retired for new keys (e.g. gemini-2.5-flash
 * now 404s for new users). flash-lite is the fastest/cheapest tier — a good fit
 * for short microcopy. Pin an explicit id via GEMINI_MODEL for reproducibility.
 */
export const DEFAULT_GEMINI_MODEL = 'gemini-flash-lite-latest'

/** Minimal shape of the generateContent response we read (all optional — defensive). */
type GeminiGenerateResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}

/**
 * Gemini adapter in the app's MicrocopyClient shape, so server/app.ts doesn't
 * change — only the injected instance does. It translates the Anthropic-shaped
 * request into Gemini's format, calls the REST API, and returns the raw model
 * text in the { content: [{ type, text }] } envelope the route already expects.
 */
export function createGeminiClient(
  apiKey: string,
  model: string = DEFAULT_GEMINI_MODEL,
): MicrocopyClient {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  return {
    messages: {
      async create(params) {
        // params.model is IGNORED on purpose. It carries the Anthropic model id
        // (app.ts is provider-agnostic and always sends its own). This client is
        // the owner of its model via `model` / GEMINI_MODEL — forwarding
        // params.model here would send a claude-* id to Google and 400.
        const requestBody = {
          systemInstruction: { parts: [{ text: params.system }] },
          contents: toGeminiContents(params.messages),
          generationConfig: {
            maxOutputTokens: params.max_tokens,
            // Disable "thinking": this is short, structured extraction, not
            // reasoning. 3.x flash models think by default (~9s+); budget 0
            // cuts latency sharply with no quality loss for this task.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }

        let res: Response
        try {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify(requestBody),
          })
        } catch (err) {
          throw new UpstreamError(502, `Gemini request failed: ${String(err)}`)
        }

        if (!res.ok) {
          // Rate limit → 429; anything else non-ok → 502 (matches the Anthropic path).
          throw new UpstreamError(
            res.status === 429 ? 429 : 502,
            `Gemini returned HTTP ${res.status}`,
          )
        }

        let body: unknown
        try {
          body = await res.json()
        } catch {
          throw new UpstreamError(502, 'Gemini returned a non-JSON response')
        }

        // Defensive extraction: any missing level → throw, never a silent undefined.
        const text = (body as GeminiGenerateResponse)?.candidates?.[0]?.content?.parts?.[0]?.text
        if (typeof text !== 'string') {
          throw new UpstreamError(
            502,
            'Gemini response missing candidates[0].content.parts[0].text',
          )
        }

        return { content: [{ type: 'text', text }] }
      },
    },
  }
}
