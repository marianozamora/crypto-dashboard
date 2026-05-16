import { render, screen } from '@testing-library/react'
import { WebSocketProvider, useWebSocketContext } from './WebSocketProvider'

vi.mock('@features/rates/hooks/useWebSocket', () => ({
  useWebSocket: vi.fn().mockReturnValue({ connectionState: 'connected' }),
}))

const ConsumerComponent = (): JSX.Element => {
  const { connectionState } = useWebSocketContext()
  return <span data-testid="state">{connectionState}</span>
}

const ThrowingConsumer = (): JSX.Element => {
  useWebSocketContext()
  return <span />
}

describe('WebSocketProvider', () => {
  it('should provide connectionState to children', () => {
    render(
      <WebSocketProvider>
        <ConsumerComponent />
      </WebSocketProvider>,
    )
    expect(screen.getByTestId('state')).toHaveTextContent('connected')
  })

  it('should throw when useWebSocketContext used outside provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<ThrowingConsumer />)).toThrow(
      'useWebSocketContext must be used within WebSocketProvider',
    )
    vi.restoreAllMocks()
  })
})
