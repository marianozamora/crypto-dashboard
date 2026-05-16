import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('should render Connecting... when variant is connecting', () => {
    render(<Badge variant="connecting" />)
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('should render Connected when variant is connected', () => {
    render(<Badge variant="connected" />)
    expect(screen.getByText('Connected')).toBeInTheDocument()
  })

  it('should render Disconnected when variant is disconnected', () => {
    render(<Badge variant="disconnected" />)
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('should have correct aria-label for each variant', () => {
    const { rerender } = render(<Badge variant="connecting" />)
    expect(screen.getByRole('generic', { name: 'Connection status: Connecting...' })).toBeInTheDocument()

    rerender(<Badge variant="connected" />)
    expect(screen.getByRole('generic', { name: 'Connection status: Connected' })).toBeInTheDocument()

    rerender(<Badge variant="disconnected" />)
    expect(screen.getByRole('generic', { name: 'Connection status: Disconnected' })).toBeInTheDocument()
  })

  it('should have data-testid="badge"', () => {
    render(<Badge variant="connected" />)
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })
})
