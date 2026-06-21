import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MicrocopyForm } from './MicrocopyForm'

const noop = () => {}

describe('MicrocopyForm', () => {
  test('renders element select, context textarea, tone select, and Generate button', () => {
    render(<MicrocopyForm onGenerate={noop} isLoading={false} />)
    expect(screen.getByLabelText(/element/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/context/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  test('calls onGenerate with the selected element, context and tone', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()
    render(<MicrocopyForm onGenerate={onGenerate} isLoading={false} />)

    await user.selectOptions(screen.getByLabelText(/element/i), 'error message')
    await user.type(screen.getByLabelText(/context/i), 'a login form')
    await user.selectOptions(screen.getByLabelText(/tone/i), 'formal')
    await user.click(screen.getByRole('button', { name: /generate/i }))

    expect(onGenerate).toHaveBeenCalledOnce()
    expect(onGenerate).toHaveBeenCalledWith('error message', 'a login form', 'formal')
  })

  test('button is disabled when isLoading is true', () => {
    render(<MicrocopyForm onGenerate={noop} isLoading={true} />)
    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled()
  })

  test('button is enabled when isLoading is false', () => {
    render(<MicrocopyForm onGenerate={noop} isLoading={false} />)
    expect(screen.getByRole('button', { name: /generate/i })).toBeEnabled()
  })

  test('element select contains all options from schema', () => {
    render(<MicrocopyForm onGenerate={noop} isLoading={false} />)
    const select = screen.getByLabelText(/element/i)
    expect(select).toContainElement(screen.getByRole('option', { name: 'button' }))
    expect(select).toContainElement(screen.getByRole('option', { name: 'empty state' }))
    expect(select).toContainElement(screen.getByRole('option', { name: 'error message' }))
  })
})
