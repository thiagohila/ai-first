import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VariantCard } from './VariantCard'

const PROPS = { text: 'Save changes', rationale: 'Direct and action-first.' }

afterEach(() => {
  vi.restoreAllMocks()
})

describe('VariantCard', () => {
  test('displays text and rationale', () => {
    render(<VariantCard {...PROPS} />)
    expect(screen.getByText('Save changes')).toBeInTheDocument()
    expect(screen.getByText('Direct and action-first.')).toBeInTheDocument()
  })

  test('calls clipboard.writeText with the variant text', async () => {
    // userEvent.setup() installs its own clipboard stub on navigator.
    // Spy on writeText after setup so the spy wraps the stub's method.
    const user = userEvent.setup()
    const spy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(<VariantCard {...PROPS} />)

    await user.click(screen.getByRole('button', { name: /copy/i }))

    await waitFor(() => expect(spy).toHaveBeenCalledWith('Save changes'))
  })

  test('shows "Copied!" feedback after successful copy', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(<VariantCard {...PROPS} />)

    await user.click(screen.getByRole('button', { name: /copy/i }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument(),
    )
  })

  test('does not crash and keeps "Copy" label when clipboard is rejected', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'))
    render(<VariantCard {...PROPS} />)

    await user.click(screen.getByRole('button', { name: /copy/i }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument(),
    )
  })
})
