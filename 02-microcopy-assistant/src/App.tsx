import { MicrocopyForm } from './components/MicrocopyForm'
import { useGenerateVariants } from './hooks/useGenerateVariants'

export default function App() {
  const { state, generate } = useGenerateVariants()

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Microcopy Assistant</h1>
      <MicrocopyForm
        onGenerate={generate}
        isLoading={state.status === 'loading'}
      />
    </main>
  )
}
