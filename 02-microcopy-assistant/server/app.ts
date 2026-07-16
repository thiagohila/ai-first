import { Hono } from 'hono'
import Anthropic from '@anthropic-ai/sdk'
import { ELEMENTS, TONES } from '../shared/constants'
import type { Element, Tone } from '../shared/constants'
import { SYSTEM_PROMPT, buildMessages } from './context'
import { rateLimit } from './rateLimit'

/** Fast/cheap model — this task is short, structured extraction, not reasoning. */
const MODEL = 'claude-haiku-4-5'
const MAX_TOKENS = 1024
const MAX_CONTEXT_CHARS = 500

/**
 * The slice of the Anthropic client the app depends on. Narrowing to this
 * makes the app trivial to test with a fake — no need to satisfy the full SDK
 * type. The real client (see server/index.ts) structurally satisfies it.
 */
export type MicrocopyClient = {
  messages: {
    create(params: {
      model: string
      max_tokens: number
      system: string
      messages: ReturnType<typeof buildMessages>
    }): Promise<{ content: Array<{ type: string; text?: string }> }>
  }
}

const isElement = (v: unknown): v is Element =>
  typeof v === 'string' && (ELEMENTS as readonly string[]).includes(v)
const isTone = (v: unknown): v is Tone =>
  typeof v === 'string' && (TONES as readonly string[]).includes(v)

/** Map a thrown error to an HTTP status: Anthropic 429 → 429; other SDK → 502; unexpected → 500. */
function statusForError(err: unknown): 429 | 502 | 500 {
  if (err instanceof Anthropic.APIError) {
    return err.status === 429 ? 429 : 502
  }
  return 500
}

export function createApp(client: MicrocopyClient) {
  const app = new Hono()

  // Rate limit BEFORE the route (Slice 3 middleware). 20 req/min per IP.
  app.use('/api/*', rateLimit())

  app.post('/api/generate', async (c) => {
    // Body must be valid JSON.
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Request body must be valid JSON.' }, 400)
    }
    if (typeof body !== 'object' || body === null) {
      return c.json({ error: 'Request body must be a JSON object.' }, 400)
    }

    const { element, context, tone } = body as Record<string, unknown>

    if (!isElement(element)) {
      return c.json({ error: `element must be one of: ${ELEMENTS.join(', ')}.` }, 400)
    }
    if (!isTone(tone)) {
      return c.json({ error: `tone must be one of: ${TONES.join(', ')}.` }, 400)
    }
    if (typeof context !== 'string' || context.trim().length === 0) {
      return c.json({ error: 'context is required and must be a non-empty string.' }, 400)
    }
    if (context.length > MAX_CONTEXT_CHARS) {
      return c.json({ error: `context must be ${MAX_CONTEXT_CHARS} characters or fewer.` }, 400)
    }

    try {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: buildMessages(element, context, tone),
      })
      const content = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text ?? '')
        .join('')
      return c.json({ content })
    } catch (err) {
      const status = statusForError(err)
      // Internal audit log: record the real error server-side; the client only
      // sees the generic message below (never leak SDK/internal details).
      console.error(`[microcopy] POST /api/generate failed (${status}):`, err)
      return c.json({ error: 'Failed to generate microcopy.' }, status)
    }
  })

  return app
}
