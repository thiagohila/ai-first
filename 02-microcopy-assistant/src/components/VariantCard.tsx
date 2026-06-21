import { useState } from 'react'

type Props = {
  text: string
  rationale: string
}

export function VariantCard({ text, rationale }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard write failed (e.g. permission denied) — no state change
    }
  }

  return (
    <article className="flex flex-col gap-2 border rounded p-4">
      <p className="font-medium">{text}</p>
      <p className="text-sm text-gray-500">{rationale}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="self-start text-sm border rounded px-3 py-1 hover:bg-gray-50"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </article>
  )
}
