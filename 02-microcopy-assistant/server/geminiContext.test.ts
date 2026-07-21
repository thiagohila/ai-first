import { describe, it, expect } from 'vitest'
import { SYSTEM_PROMPT, buildMessages } from './context'
import {
  buildGeminiContents,
  SYSTEM_PROMPT as GEMINI_SYSTEM_PROMPT,
} from './geminiContext'

describe('buildGeminiContents', () => {
  const contents = buildGeminiContents('button', 'a checkout flow', 'direct')

  it('uses only Gemini roles (user/model), with assistant mapped to model', () => {
    expect(contents.every((c) => c.role === 'user' || c.role === 'model')).toBe(true)
    expect(contents.some((c) => c.role === 'model')).toBe(true) // few-shot answers
  })

  it('wraps each message content in parts: [{ text }]', () => {
    for (const c of contents) {
      expect(c.parts).toHaveLength(1)
      expect(typeof c.parts[0].text).toBe('string')
    }
  })

  it('is derived from buildMessages — same order and content, only shape differs', () => {
    const source = buildMessages('button', 'a checkout flow', 'direct')
    expect(contents).toHaveLength(source.length)
    contents.forEach((c, i) => {
      expect(c.role).toBe(source[i].role === 'assistant' ? 'model' : 'user')
      expect(c.parts[0].text).toBe(source[i].content)
    })
  })

  it('appends the dynamic request as the final user turn', () => {
    const last = contents[contents.length - 1]
    expect(last.role).toBe('user')
    expect(last.parts[0].text).toContain('element: button')
    expect(last.parts[0].text).toContain('context: a checkout flow')
    expect(last.parts[0].text).toContain('tone: direct')
  })

  it('re-exports the same SYSTEM_PROMPT (single source, not rewritten)', () => {
    expect(GEMINI_SYSTEM_PROMPT).toBe(SYSTEM_PROMPT)
  })
})
