/**
 * Provider-neutral upstream failure. Both the Anthropic and Gemini adapters
 * throw this so the route can map errors without depending on any single
 * provider's error class. Wired into app.ts in slice G3.
 */
export class UpstreamError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'UpstreamError'
    this.status = status
  }
}
