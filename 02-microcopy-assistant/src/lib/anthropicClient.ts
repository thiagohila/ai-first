import type { AiClient } from './ai'
import { parseMicrocopyResponse } from './schema'
import type { Element, MicrocopyResponse, Result, Tone } from './schema'

const ENDPOINT = '/api/generate'

/**
 * Real AiClient: POSTs the request to the server proxy (which holds the API key
 * and calls Anthropic) and validates the returned model text with the shared
 * parser. Status → Result mapping mirrors the server's error contract.
 */
export class AnthropicAiClient implements AiClient {
  async generateVariants(
    element: Element,
    context: string,
    tone: Tone,
  ): Promise<Result<MicrocopyResponse>> {
    let res: Response
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ element, context, tone }),
      })
    } catch {
      return {
        ok: false,
        error: "We couldn't reach the server. Check your connection and try again.",
      }
    }

    if (res.status === 400) {
      return {
        ok: false,
        error: "Some of those details weren't accepted. Adjust your inputs and try again.",
      }
    }
    if (res.status === 429) {
      return {
        ok: false,
        error: 'Too many requests right now. Wait a few seconds and try again.',
      }
    }
    if (res.status >= 500) {
      return {
        ok: false,
        error: 'Something went wrong on our end. Please try again in a moment.',
      }
    }
    if (res.status !== 200) {
      return { ok: false, error: 'We got an unexpected response. Please try again.' }
    }

    // 200: the body is the { content: <raw model text> } envelope. The model
    // output is non-deterministic, so validate it with the shared parser.
    let body: unknown
    try {
      body = await res.json()
    } catch {
      return { ok: false, error: "We couldn't read the response. Please try again." }
    }
    const content = (body as { content?: unknown }).content
    if (typeof content !== 'string') {
      return { ok: false, error: "We couldn't read the response. Please try again." }
    }

    // Don't leak the internal parser detail (e.g. "Invalid JSON") to the user —
    // give a human, non-blaming message and keep the specifics out of the UI.
    const parsed = parseMicrocopyResponse(content)
    if (!parsed.ok) {
      return {
        ok: false,
        error: 'The suggestions came back in an unexpected format. Please try again.',
      }
    }
    return parsed
  }
}
