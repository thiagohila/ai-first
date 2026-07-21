import { describe, it, expect, afterEach, vi } from 'vitest'
import { createGeminiClient } from './geminiClient'
import { UpstreamError } from './errors'
import { SYSTEM_PROMPT, buildMessages } from './context'

// Params as app.ts would send them — note the Anthropic model id, which the
// Gemini client must IGNORE in favor of its own GEMINI_MODEL.
const params = {
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  system: SYSTEM_PROMPT,
  messages: buildMessages('button', 'a checkout flow', 'direct'),
}

function fakeRes(status: number, body?: unknown) {
  return { status, ok: status >= 200 && status < 300, json: async () => body }
}
function stubFetch(impl: (...args: unknown[]) => unknown) {
  const spy = vi.fn(impl)
  vi.stubGlobal('fetch', spy)
  return spy
}
afterEach(() => vi.unstubAllGlobals())

const client = createGeminiClient('test-key', 'gemini-test-model')
const okBody = { candidates: [{ content: { parts: [{ text: '{"variants":[]}' }] } }] }

describe('createGeminiClient — success & request shape', () => {
  it('extracts candidates[0].content.parts[0].text into { content: [{ type, text }] }', async () => {
    const modelText = '{"variants":[{"text":"Save","rationale":"clear"}]}'
    stubFetch(async () => fakeRes(200, { candidates: [{ content: { parts: [{ text: modelText }] } }] }))
    const res = await client.messages.create(params)
    expect(res.content).toEqual([{ type: 'text', text: modelText }])
  })

  it('POSTs systemInstruction + mapped contents to GEMINI_MODEL, ignoring params.model', async () => {
    const spy = stubFetch(async () => fakeRes(200, okBody))
    await client.messages.create(params)
    const [url, init] = spy.mock.calls[0] as [string, { body: string }]
    expect(url).toContain('/models/gemini-test-model:generateContent')
    expect(url).not.toContain('claude') // params.model was ignored
    const sent = JSON.parse(init.body) as {
      systemInstruction: { parts: { text: string }[] }
      contents: { role: string; parts: { text: string }[] }[]
      generationConfig: { thinkingConfig?: { thinkingBudget?: number } }
    }
    expect(sent.systemInstruction.parts[0].text).toBe(SYSTEM_PROMPT)
    expect(sent.contents.some((c) => c.role === 'model')).toBe(true)
    expect(sent.contents[sent.contents.length - 1].role).toBe('user')
    expect(sent.generationConfig.thinkingConfig?.thinkingBudget).toBe(0) // thinking disabled
  })
})

describe('createGeminiClient — defensive extraction & error mapping', () => {
  it('throws UpstreamError(502) when candidates/parts are missing', async () => {
    stubFetch(async () => fakeRes(200, { candidates: [] }))
    await expect(client.messages.create(params)).rejects.toMatchObject({
      name: 'UpstreamError',
      status: 502,
    })
  })

  it('maps Gemini HTTP 429 → UpstreamError(429)', async () => {
    stubFetch(async () => fakeRes(429, { error: 'quota exceeded' }))
    await expect(client.messages.create(params)).rejects.toMatchObject({ status: 429 })
  })

  it('maps other non-ok responses (5xx) → UpstreamError(502)', async () => {
    stubFetch(async () => fakeRes(503))
    await expect(client.messages.create(params)).rejects.toMatchObject({ status: 502 })
  })

  it('throws UpstreamError on network failure', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(client.messages.create(params)).rejects.toBeInstanceOf(UpstreamError)
  })
})
