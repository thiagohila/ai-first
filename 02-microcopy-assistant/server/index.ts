import { serve } from '@hono/node-server'
import Anthropic from '@anthropic-ai/sdk'
import { createApp } from './app'

// Fail early if the key is missing — the app is useless without it, and a clear
// message here beats an opaque 401 on the first request.
const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.error(
    'ANTHROPIC_API_KEY is not set. Create a .env file (see .env.example) and run with --env-file=.env.',
  )
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey })

// Adapt the real client to the app's narrow MicrocopyClient interface.
const app = createApp({
  messages: {
    create: (params) => anthropic.messages.create(params),
  },
})

const port = 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`Microcopy API listening on http://localhost:${port}`)
})
