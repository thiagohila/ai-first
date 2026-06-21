import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { FailingStubAiClient, StubAiClient } from './lib/ai'

async function fillAndSubmit() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/context/i), 'a budgeting app')
  await user.click(screen.getByRole('button', { name: /generate/i }))
}

test('renders heading', () => {
  render(<App client={new StubAiClient()} />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('shows 3 variant cards after successful generate', async () => {
  render(<App client={new StubAiClient()} />)
  await fillAndSubmit()
  await waitFor(() =>
    expect(screen.getAllByRole('article')).toHaveLength(3),
  )
})

test('shows error banner when client fails', async () => {
  render(<App client={new FailingStubAiClient()} />)
  await fillAndSubmit()
  await waitFor(() =>
    expect(screen.getByRole('alert')).toBeInTheDocument(),
  )
})

test('shows no cards and no banner before first generate', () => {
  render(<App client={new StubAiClient()} />)
  expect(screen.queryAllByRole('article')).toHaveLength(0)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
