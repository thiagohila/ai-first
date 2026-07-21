import { serve } from '@hono/node-server'
import Anthropic from '@anthropic-ai/sdk'
import { createApp, type MicrocopyClient } from './app'
import { createGeminiClient, DEFAULT_GEMINI_MODEL } from './geminiClient'
import { UpstreamError } from './errors'

type Provider = 'anthropic' | 'gemini'

// Provider selection via env; default keeps existing behavior (Anthropic).
const providerEnv = process.env.LLM_PROVIDER ?? 'anthropic'
if (providerEnv !== 'anthropic' && providerEnv !== 'gemini') {
  console.error(
    `Unknown LLM_PROVIDER "${providerEnv}". Set LLM_PROVIDER to "anthropic" or "gemini".`,
  )
  process.exit(1)
}
const provider: Provider = providerEnv

/** Read a required env var or fail early with a message naming the var and provider. */
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(
      `LLM_PROVIDER=${provider} requires ${name}, which is not set. ` +
        `Add it to .env (see .env.example) and run with --env-file=.env.`,
    )
    process.exit(1)
  }
  return value
}

// Build the client for the selected provider; both expose the same
// MicrocopyClient shape and throw UpstreamError, so app.ts stays provider-neutral.
let client: MicrocopyClient
if (provider === 'gemini') {
  const apiKey = requireEnv('GEMINI_API_KEY')
  const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL
  client = createGeminiClient(apiKey, model)
} else {
  const apiKey = requireEnv('ANTHROPIC_API_KEY')
  const anthropic = new Anthropic({ apiKey })
  client = {
    messages: {
      // Convert Anthropic's error class to the provider-neutral UpstreamError.
      create: async (params) => {
        try {
          return await anthropic.messages.create(params)
        } catch (err) {
          if (err instanceof Anthropic.APIError) {
            throw new UpstreamError(
              err.status === 429 ? 429 : 502,
              `Anthropic error (HTTP ${err.status}): ${err.message}`,
            )
          }
          throw err
        }
      },
    },
  }
}

const app = createApp(client)

const port = 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`Microcopy API (${provider}) listening on http://localhost:${port}`)
})
