import { act, renderHook } from '@testing-library/react'
import { FailingStubAiClient, StubAiClient } from '../lib/ai'
import type { AiClient } from '../lib/ai'
import type { MicrocopyResponse, Result } from '../lib/schema'
import { useGenerateVariants } from './useGenerateVariants'

class SlowThenFastClient implements AiClient {
  private call = 0
  async generateVariants(): Promise<Result<MicrocopyResponse>> {
    const n = ++this.call
    const ms = n === 1 ? 200 : 50
    await new Promise<void>((r) => setTimeout(r, ms))
    return {
      ok: true,
      data: { variants: [{ text: `call ${n}`, rationale: 'stub' }] },
    }
  }
}

const ELEMENT = 'button' as const
const TONE = 'friendly' as const
const CONTEXT = 'a budgeting app'

describe('useGenerateVariants', () => {
  test('starts idle', () => {
    const { result } = renderHook(() =>
      useGenerateVariants(new StubAiClient()),
    )
    expect(result.current.state.status).toBe('idle')
  })

  describe('happy path (StubAiClient)', () => {
    test('transitions to loading immediately after generate is called', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new StubAiClient()),
      )

      let promise!: Promise<void>
      act(() => {
        promise = result.current.generate(ELEMENT, CONTEXT, TONE)
      })

      expect(result.current.state.status).toBe('loading')
      await act(async () => { await promise })
    })

    test('transitions to success after generate resolves', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new StubAiClient()),
      )

      await act(async () => {
        await result.current.generate(ELEMENT, CONTEXT, TONE)
      })

      expect(result.current.state.status).toBe('success')
    })

    test('success state contains 3 variants', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new StubAiClient()),
      )

      await act(async () => {
        await result.current.generate(ELEMENT, CONTEXT, TONE)
      })

      const { state } = result.current
      if (state.status !== 'success') throw new Error('expected success')
      expect(state.data.variants).toHaveLength(3)
    })
  })

  describe('error path (FailingStubAiClient)', () => {
    test('transitions to loading immediately after generate is called', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new FailingStubAiClient()),
      )

      let promise!: Promise<void>
      act(() => {
        promise = result.current.generate(ELEMENT, CONTEXT, TONE)
      })

      expect(result.current.state.status).toBe('loading')
      await act(async () => { await promise })
    })

    test('transitions to error after generate resolves', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new FailingStubAiClient()),
      )

      await act(async () => {
        await result.current.generate(ELEMENT, CONTEXT, TONE)
      })

      expect(result.current.state.status).toBe('error')
    })

    test('error state contains a non-empty message', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new FailingStubAiClient()),
      )

      await act(async () => {
        await result.current.generate(ELEMENT, CONTEXT, TONE)
      })

      const { state } = result.current
      if (state.status !== 'error') throw new Error('expected error')
      expect(state.error.length).toBeGreaterThan(0)
    })
  })

  describe('race condition', () => {
    test('only the last call result is applied when two calls overlap', async () => {
      const { result } = renderHook(() =>
        useGenerateVariants(new SlowThenFastClient()),
      )

      await act(async () => {
        const first = result.current.generate(ELEMENT, CONTEXT, TONE)
        const second = result.current.generate(ELEMENT, CONTEXT, TONE)
        await Promise.all([first, second])
      })

      const { state } = result.current
      if (state.status !== 'success') throw new Error('expected success')
      expect(state.data.variants[0].text).toBe('call 2')
    })
  })
})
