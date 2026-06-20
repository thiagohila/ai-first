import { parseMicrocopyResponse } from './schema'

const VALID_RAW = JSON.stringify({
  variants: [
    { text: 'Save expense', rationale: 'Plain and action-first.' },
    { text: 'Add it', rationale: 'Short and casual.' },
    { text: 'Done — save', rationale: 'Confirms completion.' },
  ],
})

describe('parseMicrocopyResponse', () => {
  describe('valid JSON', () => {
    test('returns ok: true with the parsed data', () => {
      const result = parseMicrocopyResponse(VALID_RAW)
      expect(result.ok).toBe(true)
    })

    test('data contains exactly the variants from the JSON', () => {
      const result = parseMicrocopyResponse(VALID_RAW)
      if (!result.ok) throw new Error('expected ok')
      expect(result.data.variants).toHaveLength(3)
      expect(result.data.variants[0]).toEqual({
        text: 'Save expense',
        rationale: 'Plain and action-first.',
      })
    })
  })

  describe('wrong structure', () => {
    test('missing variants key returns ok: false', () => {
      const result = parseMicrocopyResponse(JSON.stringify({ foo: 'bar' }))
      expect(result.ok).toBe(false)
    })

    test('variants is not an array returns ok: false', () => {
      const result = parseMicrocopyResponse(JSON.stringify({ variants: 'oops' }))
      expect(result.ok).toBe(false)
    })

    test('variant item missing rationale returns ok: false', () => {
      const result = parseMicrocopyResponse(
        JSON.stringify({ variants: [{ text: 'Only text' }] }),
      )
      expect(result.ok).toBe(false)
    })

    test('variant item missing text returns ok: false', () => {
      const result = parseMicrocopyResponse(
        JSON.stringify({ variants: [{ rationale: 'Only rationale' }] }),
      )
      expect(result.ok).toBe(false)
    })

    test('empty variants array returns ok: false', () => {
      const result = parseMicrocopyResponse(JSON.stringify({ variants: [] }))
      expect(result.ok).toBe(false)
    })

    test('variant item is a primitive returns ok: false', () => {
      const result = parseMicrocopyResponse(JSON.stringify({ variants: [42] }))
      expect(result.ok).toBe(false)
    })

    test('variant item is null returns ok: false', () => {
      const result = parseMicrocopyResponse(JSON.stringify({ variants: [null] }))
      expect(result.ok).toBe(false)
    })
  })

  describe('non-JSON input', () => {
    test('plain string returns ok: false', () => {
      const result = parseMicrocopyResponse('not json at all')
      expect(result.ok).toBe(false)
    })

    test('empty string returns ok: false', () => {
      const result = parseMicrocopyResponse('')
      expect(result.ok).toBe(false)
    })

    test('error message contains a description', () => {
      const result = parseMicrocopyResponse('not json')
      if (result.ok) throw new Error('expected error')
      expect(result.error.length).toBeGreaterThan(0)
    })
  })
})
