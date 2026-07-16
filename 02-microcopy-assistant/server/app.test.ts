import { describe, it, expect } from 'vitest'
import Anthropic from '@anthropic-ai/sdk'
import { createApp, type MicrocopyClient } from './app'

// Build an app around a fake client whose messages.create is fully controlled
// by the test — this is how we exercise the route without a real API call.
function appWith(create: MicrocopyClient['messages']['create']) {
  return createApp({ messages: { create } })
}

const okClient = appWith(async () => ({
  content: [{ type: 'text', text: '{"variants":[]}' }],
}))

function post(app: ReturnType<typeof createApp>, body: unknown) {
  return app.request('/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const VALID = { element: 'button', context: 'save a new expense', tone: 'friendly' }

describe('POST /api/generate — success', () => {
  it('returns 200 with the raw model text as { content }', async () => {
    const res = await post(okClient, VALID)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ content: '{"variants":[]}' })
  })
})

describe('POST /api/generate — validation (400)', () => {
  it('rejects invalid JSON', async () => {
    const res = await okClient.request('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json',
    })
    expect(res.status).toBe(400)
  })

  it('rejects an element not in ELEMENTS', async () => {
    const res = await post(okClient, { ...VALID, element: 'tooltip' })
    expect(res.status).toBe(400)
  })

  it('rejects a tone not in TONES', async () => {
    const res = await post(okClient, { ...VALID, tone: 'sarcastic' })
    expect(res.status).toBe(400)
  })

  it('rejects empty context', async () => {
    const res = await post(okClient, { ...VALID, context: '   ' })
    expect(res.status).toBe(400)
  })

  it('rejects context longer than 500 chars', async () => {
    const res = await post(okClient, { ...VALID, context: 'a'.repeat(501) })
    expect(res.status).toBe(400)
  })

  it('does not call the model when input is invalid', async () => {
    let called = false
    const app = appWith(async () => {
      called = true
      return { content: [] }
    })
    await post(app, { ...VALID, element: 'nope' })
    expect(called).toBe(false)
  })
})

describe('POST /api/generate — error mapping', () => {
  it('maps an Anthropic 429 to 429', async () => {
    const app = appWith(async () => {
      throw new Anthropic.APIError(429, undefined, 'rate limited', undefined)
    })
    const res = await post(app, VALID)
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ error: expect.any(String) })
  })

  it('maps other Anthropic SDK errors to 502', async () => {
    const app = appWith(async () => {
      throw new Anthropic.APIError(500, undefined, 'server error', undefined)
    })
    const res = await post(app, VALID)
    expect(res.status).toBe(502)
  })

  it('maps unexpected (non-SDK) errors to 500', async () => {
    const app = appWith(async () => {
      throw new Error('boom')
    })
    const res = await post(app, VALID)
    expect(res.status).toBe(500)
  })
})
