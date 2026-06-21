import { useRef, useState } from 'react'
import { defaultClient } from '../lib/ai'
import type { AiClient } from '../lib/ai'
import type { Element, MicrocopyResponse, Tone } from '../lib/schema'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: MicrocopyResponse }
  | { status: 'error'; error: string }

export function useGenerateVariants(client: AiClient = defaultClient) {
  const [state, setState] = useState<State>({ status: 'idle' })
  const callId = useRef(0)

  async function generate(element: Element, context: string, tone: Tone) {
    const id = ++callId.current
    setState({ status: 'loading' })
    const result = await client.generateVariants(element, context, tone)
    if (id !== callId.current) return
    if (result.ok) {
      setState({ status: 'success', data: result.data })
    } else {
      setState({ status: 'error', error: result.error })
    }
  }

  return { state, generate }
}
