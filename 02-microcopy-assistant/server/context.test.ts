import { describe, it, expect } from 'vitest'
import { SYSTEM_PROMPT, FEW_SHOT_MESSAGES, buildMessages } from './context'

describe('SYSTEM_PROMPT', () => {
  it('contains the JSON output format instruction', () => {
    expect(SYSTEM_PROMPT).toContain('"variants"')
    expect(SYSTEM_PROMPT).toContain('"text"')
    expect(SYSTEM_PROMPT).toContain('"rationale"')
  })

  it('instructs exactly 3 variants', () => {
    expect(SYSTEM_PROMPT).toContain('exactly 3 variants')
  })

  it('instructs JSON-only response (no markdown)', () => {
    expect(SYSTEM_PROMPT).toContain('no markdown')
  })
})

describe('FEW_SHOT_MESSAGES', () => {
  it('has exactly 6 messages (3 pairs)', () => {
    expect(FEW_SHOT_MESSAGES).toHaveLength(6)
  })

  it('alternates user/assistant roles', () => {
    const expectedRoles = ['user', 'assistant', 'user', 'assistant', 'user', 'assistant']
    expect(FEW_SHOT_MESSAGES.map((m) => m.role)).toEqual(expectedRoles)
  })

  it('covers button, error message, and empty state elements', () => {
    const userMessages = FEW_SHOT_MESSAGES.filter((m) => m.role === 'user').map((m) => m.content)
    expect(userMessages.some((c) => c.includes('element: button'))).toBe(true)
    expect(userMessages.some((c) => c.includes('element: error message'))).toBe(true)
    expect(userMessages.some((c) => c.includes('element: empty state'))).toBe(true)
  })

  it('each assistant message is valid JSON with 3 variants', () => {
    const assistantMessages = FEW_SHOT_MESSAGES.filter((m) => m.role === 'assistant')
    for (const msg of assistantMessages) {
      const parsed = JSON.parse(msg.content) as { variants: unknown[] }
      expect(Array.isArray(parsed.variants)).toBe(true)
      expect(parsed.variants).toHaveLength(3)
    }
  })
})

describe('buildMessages', () => {
  const result = buildMessages('button', 'a checkout flow', 'direct')

  it('returns exactly 7 messages', () => {
    expect(result).toHaveLength(7)
  })

  it('first 6 messages are the few-shot pairs', () => {
    expect(result.slice(0, 6)).toEqual(FEW_SHOT_MESSAGES)
  })

  it('last message is user role', () => {
    expect(result[6].role).toBe('user')
  })

  it('last message contains the three interpolated fields', () => {
    const content = result[6].content
    expect(content).toContain('element: button')
    expect(content).toContain('context: a checkout flow')
    expect(content).toContain('tone: direct')
  })

  it('does not mutate FEW_SHOT_MESSAGES', () => {
    const before = FEW_SHOT_MESSAGES.length
    buildMessages('button', 'test', 'friendly')
    expect(FEW_SHOT_MESSAGES).toHaveLength(before)
  })
})
