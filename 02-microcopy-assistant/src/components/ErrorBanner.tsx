type Props = {
  message: string
}

export function ErrorBanner({ message }: Props) {
  return (
    <div role="alert" className="border border-red-300 bg-red-50 text-red-700 rounded p-4">
      {message}
    </div>
  )
}
