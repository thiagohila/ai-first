type MessageParam = { role: 'user' | 'assistant'; content: string }

export const SYSTEM_PROMPT = `You are a UX writing (microcopy) specialist. Your job is to generate short,
usable text variants for interface elements.

You will receive:
- element: the UI element type (e.g. button, empty state, error message)
- context: one sentence about the product/situation
- tone: the desired tone (e.g. friendly, formal, direct)

Rules:
- Generate exactly 3 variants.
- Respect the requested tone and the element type (buttons = short and
  actionable; error messages = clear and never blame the user; empty states =
  guide the next action).
- Write in English.
- Do not invent names, numbers, or facts that aren't in the context.
- For each variant, add a one-line rationale.

Respond with valid JSON only — no markdown, no text before or after — in this
exact format:
{ "variants": [ { "text": "string", "rationale": "string" } ] }`

export const FEW_SHOT_MESSAGES: MessageParam[] = [
  {
    role: 'user',
    content:
      'element: button\ncontext: a budgeting app; this button saves a new expense the user just entered\ntone: friendly',
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      variants: [
        { text: 'Save expense', rationale: 'Plain and action-first; the user knows exactly what happens.' },
        { text: 'Add it', rationale: 'Short and casual, matching a friendly tone.' },
        { text: 'Done — save', rationale: 'Confirms completion and the action in two beats.' },
      ],
    }),
  },
  {
    role: 'user',
    content:
      'element: error message\ncontext: a login form; the password the user entered is incorrect\ntone: clear and reassuring',
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      variants: [
        { text: "That password doesn't match. Want to try again?", rationale: 'States the issue without blaming; offers a path forward.' },
        { text: "Hmm, that didn't work — double-check your password.", rationale: 'Non-accusatory and actionable.' },
        { text: "Incorrect password. Reset it if you've forgotten.", rationale: 'Clear, with an escape hatch for the stuck user.' },
      ],
    }),
  },
  {
    role: 'user',
    content:
      'element: empty state\ncontext: a task manager; the user has no tasks yet\ntone: encouraging',
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      variants: [
        { text: 'No tasks yet — add your first one to get started.', rationale: 'Orients to the next action with positive framing.' },
        { text: 'Your list is clear. Ready to add something?', rationale: 'Frames the empty state as a fresh start and invites action.' },
        { text: 'Nothing here yet. Tap + to create a task.', rationale: 'Names the concrete next step and the UI affordance.' },
      ],
    }),
  },
]

export function buildMessages(element: string, context: string, tone: string): MessageParam[] {
  return [
    ...FEW_SHOT_MESSAGES,
    { role: 'user', content: `element: ${element}\ncontext: ${context}\ntone: ${tone}` },
  ]
}
