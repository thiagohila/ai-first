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
    <article className="bg-md-surface rounded-xl p-5 flex flex-col gap-2 shadow-el-1">
      <p className="text-base font-medium text-md-on-surface">{text}</p>
      <p className="text-sm text-md-on-surface-variant">{rationale}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="self-start mt-1 bg-md-secondary-container text-md-on-secondary-container
          rounded-full px-4 h-9 text-sm font-medium transition-shadow
          hover:shadow-el-1 active:shadow-none cursor-pointer"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </article>
  )
}
