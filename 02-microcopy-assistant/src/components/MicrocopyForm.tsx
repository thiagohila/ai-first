import { type FormEvent, useState } from 'react'
import { ELEMENTS, TONES } from '../lib/schema'
import type { Element, Tone } from '../lib/schema'

type Props = {
  onGenerate: (element: Element, context: string, tone: Tone) => void
  isLoading: boolean
}

export function MicrocopyForm({ onGenerate, isLoading }: Props) {
  const [element, setElement] = useState<Element>(ELEMENTS[0])
  const [context, setContext] = useState('')
  const [tone, setTone] = useState<Tone>(TONES[0])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onGenerate(element, context, tone)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1">
        <label htmlFor="element" className="text-sm font-medium">
          Element
        </label>
        <select
          id="element"
          value={element}
          onChange={(e) => setElement(e.target.value as Element)}
          className="border rounded px-3 py-2"
        >
          {ELEMENTS.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="context" className="text-sm font-medium">
          Context
        </label>
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          required
          placeholder="Describe the product and situation in one sentence"
          className="border rounded px-3 py-2 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tone" className="text-sm font-medium">
          Tone
        </label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value as Tone)}
          className="border rounded px-3 py-2"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isLoading ? 'Generating…' : 'Generate'}
      </button>
    </form>
  )
}
