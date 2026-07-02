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
    <div className="min-h-screen bg-md-surface-container">
      <header className="bg-md-surface sticky top-0 z-10 shadow-el-1">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <h1 className="text-[22px] font-medium text-md-on-surface tracking-[0.0125em]">
            Microcopy Assistant
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        <MicrocopyForm
          onGenerate={generate}
          isLoading={state.status === 'loading'}
        />

        {state.status === 'success' && (
          <div className="flex flex-col gap-3">
            {state.data.variants.map((v, i) => (
              <VariantCard key={i} text={v.text} rationale={v.rationale} />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <ErrorBanner message={state.error} />
        )}
      </main>
    </div>
  )
}
