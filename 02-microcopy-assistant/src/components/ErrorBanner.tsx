type Props = {
  message: string
}

export function ErrorBanner({ message }: Props) {
  return (
    <div role="alert" className="bg-md-error-container text-md-on-error-container rounded-xl p-4 flex items-start gap-3">
      <span className="text-md-error text-lg leading-5 shrink-0" aria-hidden="true">⚠</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
