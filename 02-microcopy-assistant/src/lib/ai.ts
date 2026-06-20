import type { Element, MicrocopyResponse, Result, Tone } from './schema'

export interface AiClient {
  generateVariants(
    element: Element,
    context: string,
    tone: Tone,
  ): Promise<Result<MicrocopyResponse>>
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export class StubAiClient implements AiClient {
  async generateVariants(
    _element: Element,
    _context: string,
    _tone: Tone,
  ): Promise<Result<MicrocopyResponse>> {
    await delay(300)
    return {
      ok: true,
      data: {
        variants: [
          {
            text: 'Save changes',
            rationale:
              'Plain and action-first; the user knows exactly what happens.',
          },
          {
            text: 'Done',
            rationale: 'Minimal and confident — fits a friendly tone.',
          },
          {
            text: 'Got it',
            rationale: 'Casual confirmation for an informal product.',
          },
        ],
      },
    }
  }
}

export class FailingStubAiClient implements AiClient {
  async generateVariants(
    _element: Element,
    _context: string,
    _tone: Tone,
  ): Promise<Result<MicrocopyResponse>> {
    await delay(300)
    return { ok: false, error: 'Stub error: simulated failure' }
  }
}

export const defaultClient: AiClient = new StubAiClient()
