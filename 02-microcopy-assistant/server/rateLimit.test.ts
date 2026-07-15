import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Hono } from 'hono'
import { rateLimit } from './rateLimit'

// A minimal app that mounts the limiter (defaults: 20 req / 60s) over one route.
function makeApp() {
  const app = new Hono()
  app.use('*', rateLimit())
  app.get('/', (c) => c.text('ok'))
  return app
}

// Fire one request as a given IP (set via x-forwarded-for).
function hit(app: Hono, ip: string) {
  return app.request('/', { headers: { 'x-forwarded-for': ip } })
}

describe('rateLimit', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('allows 20 requests from the same IP', async () => {
    const app = makeApp()
    for (let i = 0; i < 20; i++) {
      const res = await hit(app, '1.1.1.1')
      expect(res.status).toBe(200)
    }
  })

  it('blocks the 21st request with 429 and an error body', async () => {
    const app = makeApp()
    for (let i = 0; i < 20; i++) await hit(app, '1.1.1.1')

    const res = await hit(app, '1.1.1.1')
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ error: expect.any(String) })
  })

  it('does not affect a different IP', async () => {
    const app = makeApp()
    for (let i = 0; i < 20; i++) await hit(app, '1.1.1.1') // exhaust 1.1.1.1
    expect((await hit(app, '1.1.1.1')).status).toBe(429)

    // A fresh IP has its own counter.
    const res = await hit(app, '2.2.2.2')
    expect(res.status).toBe(200)
  })

  it('resets the counter after the window expires', async () => {
    const app = makeApp()
    for (let i = 0; i < 20; i++) await hit(app, '1.1.1.1')
    expect((await hit(app, '1.1.1.1')).status).toBe(429) // over the limit

    vi.advanceTimersByTime(60_000) // window elapses

    const res = await hit(app, '1.1.1.1')
    expect(res.status).toBe(200) // counter reset, allowed again
  })
})
