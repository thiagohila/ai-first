export const ELEMENTS = ['button', 'empty state', 'error message'] as const
export type Element = (typeof ELEMENTS)[number]

export const TONES = [
  'friendly',
  'formal',
  'direct',
  'encouraging',
  'clear and reassuring',
] as const
export type Tone = (typeof TONES)[number]

export type Variant = {
  text: string
  rationale: string
}

export type MicrocopyResponse = {
  variants: Variant[]
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

function isVariant(x: unknown): x is Variant {
  const v = x as Record<string, unknown>
  return typeof x === 'object' && x !== null
    && typeof v.text === 'string'
    && typeof v.rationale === 'string'
}

export function parseMicrocopyResponse(raw: string): Result<MicrocopyResponse> {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !Array.isArray((parsed as Record<string, unknown>).variants)
  ) {
    return { ok: false, error: 'Missing or invalid "variants" array' }
  }

  const variants = (parsed as { variants: unknown[] }).variants

  if (variants.length === 0) {
    return { ok: false, error: '"variants" must not be empty' }
  }

  if (!variants.every(isVariant)) {
    return {
      ok: false,
      error: 'Each variant must have "text" and "rationale" as strings',
    }
  }

  return { ok: true, data: { variants } }
}
