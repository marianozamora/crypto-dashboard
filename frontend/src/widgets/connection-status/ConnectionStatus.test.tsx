import { render, screen } from '@testing-library/react'
import type { ConnectionState } from '@crypto/shared'
import { ConnectionStatus } from './ConnectionStatus'
import { WebSocketContext } from '@app/providers/WebSocketProvider'

const renderWithState = (connectionState: ConnectionState): void => {
  render(
    <WebSocketContext.Provider value={{ connectionState }}>
      <ConnectionStatus />
    </WebSocketContext.Provider>,
  )
}

describe('ConnectionStatus', () => {
  it('should render badge with connecting variant', () => {
    renderWithState('connecting')
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('should render badge with connected variant', () => {
    renderWithState('connected')
    expect(screen.getByText('Connected')).toBeInTheDocument()
  })

  it('should render badge with disconnected variant', () => {
    renderWithState('disconnected')
    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('should have data-testid="connection-status"', () => {
    renderWithState('connected')
    expect(screen.getByTestId('connection-status')).toBeInTheDocument()
  })
})
