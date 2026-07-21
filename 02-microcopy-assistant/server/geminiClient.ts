import { toGeminiContents } from './geminiContext'
import { UpstreamError } from './errors'
import type { MicrocopyClient } from './app'

/**
 * Default Gemini model — configurable via the `model` arg (server/index.ts
 * passes GEMINI_MODEL). NOTE: verify the current model id against Google's docs
 * before real use; this default may be out of date.
 */
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'

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
          generationConfig: { maxOutputTokens: params.max_tokens },
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
