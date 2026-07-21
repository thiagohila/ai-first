import { describe, it, expect, afterEach, vi } from 'vitest'
import { AnthropicAiClient } from './anthropicClient'

const client = new AnthropicAiClient()

// Minimal fake of the parts of Response the client reads: status + json().
function fakeRes(status: number, body?: unknown) {
  return { status, json: async () => body }
}
function stubFetch(impl: (...args: unknown[]) => unknown) {
  const spy = vi.fn(impl)
  vi.stubGlobal('fetch', spy)
  return spy
}

// A valid model payload (the JSON string the model would have produced).
const VALID_CONTENT = JSON.stringify({
  variants: [{ text: 'Save changes', rationale: 'Plain and action-first.' }],
})

afterEach(() => vi.unstubAllGlobals())

describe('AnthropicAiClient — status → Result mapping', () => {
  it('200 + valid JSON → ok', async () => {
    stubFetch(async () => fakeRes(200, { content: VALID_CONTENT }))
    const r = await client.generateVariants('button', 'a checkout button', 'friendly')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.variants).toHaveLength(1)
  })

  it('200 + invalid JSON → parse error', async () => {
    stubFetch(async () => fakeRes(200, { content: 'not valid json' }))
    const r = await client.generateVariants('button', 'a checkout button', 'friendly')
    expect(r.ok).toBe(false)
  })

  it('400 → invalid input', async () => {
    stubFetch(async () => fakeRes(400, { error: 'bad request' }))
    const r = await client.generateVariants('button', 'a checkout button', 'friendly')
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/adjust your inputs/i) })
  })

  it('429 → rate limit', async () => {
    stubFetch(async () => fakeRes(429))
    const r = await client.generateVariants('button', 'a checkout button', 'friendly')
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/too many requests/i) })
  })

  it('5xx → server error', async () => {
    stubFetch(async () => fakeRes(503))
    const r = await client.generateVariants('button', 'a checkout button', 'friendly')
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/our end/i) })
  })

  it('network failure → network error', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    const r = await client.generateVariants('button', 'a checkout button', 'friendly')
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/couldn't reach the server/i) })
  })
})

describe('AnthropicAiClient — request shape', () => {
  it('POSTs { element, context, tone } to /api/generate', async () => {
    const spy = stubFetch(async () => fakeRes(200, { content: VALID_CONTENT }))
    await client.generateVariants('empty state', 'no items yet', 'encouraging')
    expect(spy).toHaveBeenCalledWith(
      '/api/generate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          element: 'empty state',
          context: 'no items yet',
          tone: 'encouraging',
        }),
      }),
    )
  })
})
