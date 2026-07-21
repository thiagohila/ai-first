import { SYSTEM_PROMPT, buildMessages } from './context'
import type { Element, Tone } from '../shared/constants'

// The system prompt is provider-agnostic (it just demands the JSON contract), so
// reuse it verbatim — on Gemini it goes in `systemInstruction`, not in `contents`.
export { SYSTEM_PROMPT }

export type GeminiRole = 'user' | 'model'
export type GeminiContent = { role: GeminiRole; parts: { text: string }[] }

/**
 * Structural translation of Anthropic-shaped messages into Gemini `contents`:
 * role 'assistant' → 'model', content → parts: [{ text }]. This is the single
 * mapping used by both entry points below — no example is re-authored, so the
 * two providers can't drift. The Gemini client calls this with the messages it
 * receives (already built by buildMessages upstream).
 */
export function toGeminiContents(
  messages: ReturnType<typeof buildMessages>,
): GeminiContent[] {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }))
}

/** Convenience: build straight from the request inputs, via the single source. */
export function buildGeminiContents(
  element: Element,
  context: string,
  tone: Tone,
): GeminiContent[] {
  return toGeminiContents(buildMessages(element, context, tone))
}
