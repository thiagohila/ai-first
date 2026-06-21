import type { AiClient } from './lib/ai'
import { ErrorBanner } from './components/ErrorBanner'
import { MicrocopyForm } from './components/MicrocopyForm'
import { VariantCard } from './components/VariantCard'
import { useGenerateVariants } from './hooks/useGenerateVariants'

type Props = {
  client?: AiClient
}

export default function App({ client }: Props) {
  const { state, generate } = useGenerateVariants(client)

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Microcopy Assistant</h1>
      <MicrocopyForm
        onGenerate={generate}
        isLoading={state.status === 'loading'}
      />
      {state.status === 'success' && (
        <div className="flex flex-col gap-4 mt-8">
          {state.data.variants.map((v, i) => (
            <VariantCard key={i} text={v.text} rationale={v.rationale} />
          ))}
        </div>
      )}
      {state.status === 'error' && (
        <div className="mt-8">
          <ErrorBanner message={state.error} />
        </div>
      )}
    </main>
  )
}
