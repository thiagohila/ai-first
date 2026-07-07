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
