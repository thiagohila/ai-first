import { FailingStubAiClient, StubAiClient } from './ai'

const ELEMENT = 'button' as const
const TONE = 'friendly' as const
const CONTEXT = 'a budgeting app'

describe('StubAiClient', () => {
  test('resolves with ok: true', async () => {
    const client = new StubAiClient()
    const result = await client.generateVariants(ELEMENT, CONTEXT, TONE)
    expect(result.ok).toBe(true)
  })

  test('returns exactly 3 variants', async () => {
    const client = new StubAiClient()
    const result = await client.generateVariants(ELEMENT, CONTEXT, TONE)
    if (!result.ok) throw new Error('expected ok')
    expect(result.data.variants).toHaveLength(3)
  })

  test('each variant has text and rationale', async () => {
    const client = new StubAiClient()
    const result = await client.generateVariants(ELEMENT, CONTEXT, TONE)
    if (!result.ok) throw new Error('expected ok')
    for (const v of result.data.variants) {
      expect(typeof v.text).toBe('string')
      expect(typeof v.rationale).toBe('string')
    }
  })
})

describe('FailingStubAiClient', () => {
  test('resolves with ok: false', async () => {
    const client = new FailingStubAiClient()
    const result = await client.generateVariants(ELEMENT, CONTEXT, TONE)
    expect(result.ok).toBe(false)
  })

  test('error message is non-empty', async () => {
    const client = new FailingStubAiClient()
    const result = await client.generateVariants(ELEMENT, CONTEXT, TONE)
    if (result.ok) throw new Error('expected error')
    expect(result.error.length).toBeGreaterThan(0)
  })
})
