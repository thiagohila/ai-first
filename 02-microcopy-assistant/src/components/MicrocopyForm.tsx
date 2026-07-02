import { type FormEvent, useState } from 'react'
import { ELEMENTS, TONES, isElement, isTone } from '../lib/schema'
import type { Element, Tone } from '../lib/schema'

type Props = {
  onGenerate: (element: Element, context: string, tone: Tone) => void
  isLoading: boolean
}

const fieldClass =
  'w-full border-2 border-md-outline rounded-sm bg-md-surface px-4 py-3 text-sm text-md-on-surface ' +
  'transition-colors hover:border-md-on-surface focus:outline-none focus:border-md-primary ' +
  'focus:ring-[3px] focus:ring-md-primary/[0.12]'

export function MicrocopyForm({ onGenerate, isLoading }: Props) {
  const [element, setElement] = useState<Element>(ELEMENTS[0])
  const [context, setContext] = useState('')
  const [tone, setTone] = useState<Tone>(TONES[0])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onGenerate(element, context, tone)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-md-surface rounded-2xl p-6 flex flex-col gap-5 shadow-el-1"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="element" className="text-xs font-medium text-md-on-surface-variant">
          Element
        </label>
        <select
          id="element"
          value={element}
          onChange={(e) => isElement(e.target.value) && setElement(e.target.value)}
          className={fieldClass}
        >
          {ELEMENTS.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="context" className="text-xs font-medium text-md-on-surface-variant">
          Context
        </label>
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          required
          placeholder="Describe the product and situation in one sentence"
          className={`${fieldClass} resize-none placeholder:text-md-on-surface-variant/50`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tone" className="text-xs font-medium text-md-on-surface-variant">
          Tone
        </label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => isTone(e.target.value) && setTone(e.target.value)}
          className={fieldClass}
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
        className="self-end bg-md-primary text-md-on-primary rounded-full h-10 px-6 text-sm font-medium
          tracking-[0.00625em] transition-shadow hover:shadow-el-1 active:shadow-none
          disabled:bg-md-on-surface/[0.12] disabled:text-md-on-surface/[0.38]
          disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? 'Generating…' : 'Generate'}
      </button>
    </form>
  )
}
