import type { Context, MiddlewareHandler } from 'hono'

type Options = {
  /** Max requests allowed per key within the window. Default 20. */
  limit?: number
  /** Window length in milliseconds. Default 60_000 (1 minute). */
  windowMs?: number
  /** How to derive the rate-limit key from the request. Default: client IP. */
  keyFn?: (c: Context) => string
}

type Entry = { count: number; resetAt: number }

/**
 * In-memory fixed-window rate limiter as a Hono middleware.
 *
 * Each key (client IP by default) may make `limit` requests per `windowMs`.
 * The request that would exceed the limit is answered with 429 and never
 * reaches the next handler. The window is per-instance (closure Map), so each
 * rateLimit() call has isolated state — a global singleton would leak between
 * tests and mounts.
 *
 * Not wired into the app yet — that's Slice 4.
 */
export function rateLimit(options: Options = {}): MiddlewareHandler {
  const limit = options.limit ?? 20
  const windowMs = options.windowMs ?? 60_000
  const keyFn = options.keyFn ?? clientIp
  const hits = new Map<string, Entry>()

  return async (c, next) => {
    const key = keyFn(c)
    const now = Date.now()

    let entry = hits.get(key)
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs }
      hits.set(key, entry)
    }

    entry.count++
    if (entry.count > limit) {
      return c.json({ error: 'Too many requests. Please slow down and try again shortly.' }, 429)
    }

    await next()
  }
}

/** Best-effort client IP: first entry of x-forwarded-for, then x-real-ip. */
function clientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return c.req.header('x-real-ip') ?? 'unknown'
}
