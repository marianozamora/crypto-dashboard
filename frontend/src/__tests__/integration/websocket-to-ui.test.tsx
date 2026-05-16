import { render, screen, act } from '@testing-library/react'
import type { RateUpdate, MarketCommentary } from '@crypto/shared'
import { SOCKET_EVENTS } from '@crypto/shared'
import { PairCard } from '@widgets/pair-card'
import { RateChart } from '@widgets/rate-chart'
import { CommentaryWidget } from '@widgets/commentary'
import { useWebSocket } from '@features/rates/hooks/useWebSocket'
import { useRatesStore } from '@features/rates/store/rates.store'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'

vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }): JSX.Element => <div>{children}</div>,
  Line: (): null => null,
  XAxis: (): null => null,
  YAxis: (): null => null,
  CartesianGrid: (): null => null,
  Tooltip: (): null => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),
}))

type MockClient = {
  connect: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
  on: ReturnType<typeof vi.fn>
  onStateChange: ReturnType<typeof vi.fn>
  getConnectionState: ReturnType<typeof vi.fn>
}

const mockClient = vi.hoisted(
  (): MockClient => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    onStateChange: vi.fn(),
    getConnectionState: vi.fn().mockReturnValue('connecting'),
  }),
)

vi.mock('@lib/websocket/WebSocketClient', () => ({
  createWebSocketClient: vi.fn().mockImplementation(() => mockClient),
}))

const mockRate: RateUpdate = {
  pair: 'ETH/USDC',
  price: 2341.56,
  timestamp: '2025-01-15T10:30:00.000Z',
  hourlyAverage: 2310.0,
}

const updatedRate: RateUpdate = {
  ...mockRate,
  price: 2400.0,
  timestamp: '2025-01-15T10:31:00.000Z',
}

const mockCommentary: MarketCommentary = {
  text: 'ETH markets show strong upward momentum.',
  generatedAt: '2025-01-15T10:00:00.000Z',
  pairs: ['ETH/USDT', 'ETH/USDC', 'ETH/BTC'],
}

const getSocketHandler = (event: string): ((data: unknown) => void) => {
  const call = (mockClient.on.mock.calls as [string, (data: unknown) => void][]).find(
    ([e]) => e === event,
  )
  if (!call) throw new Error(`No handler registered for socket event: ${event}`)
  return call[1]
}

const WithWebSocket = ({ children }: { readonly children: React.ReactNode }): JSX.Element => {
  useWebSocket()
  return <>{children}</>
}

describe('Zustand reactive subscriptions — store update triggers re-render without manual rerender()', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
    useCommentaryStore.setState({ commentary: null })
  })

  it('should update PairCard price in DOM when store receives rate update', () => {
    render(<PairCard pair="ETH/USDC" />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(mockRate) })

    expect(screen.queryByTestId('price-tag-skeleton')).not.toBeInTheDocument()
    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,341.56')
  })

  it('should reflect latest price when a second rate update arrives', () => {
    render(<PairCard pair="ETH/USDC" />)
    act(() => { useRatesStore.getState().updateRate(mockRate) })
    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,341.56')

    act(() => { useRatesStore.getState().updateRate(updatedRate) })
    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,400.00')
  })

  it('should transition CommentaryWidget from loading to text when commentary arrives', () => {
    render(<CommentaryWidget />)
    expect(screen.getByTestId('commentary-loading')).toBeInTheDocument()

    act(() => { useCommentaryStore.getState().setCommentary(mockCommentary) })

    expect(screen.queryByTestId('commentary-loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('commentary-text')).toHaveTextContent(
      'ETH markets show strong upward momentum.',
    )
  })

  it('should transition RateChart from spinner to chart when first rate arrives', () => {
    render(<RateChart pair="ETH/USDC" />)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(mockRate) })

    expect(screen.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
  })
})

describe('WebSocket → Store → DOM full chain', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRatesStore.getState().reset()
    useCommentaryStore.setState({ commentary: null })
  })

  it('should display price in PairCard when RATE_UPDATE socket event fires', () => {
    render(
      <WithWebSocket>
        <PairCard pair="ETH/USDC" />
      </WithWebSocket>,
    )

    const rateHandler = getSocketHandler(SOCKET_EVENTS.RATE_UPDATE)
    act(() => { rateHandler(mockRate) })

    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,341.56')
  })

  it('should show commentary text in CommentaryWidget when COMMENTARY_UPDATE socket event fires', () => {
    render(
      <WithWebSocket>
        <CommentaryWidget />
      </WithWebSocket>,
    )

    const commentaryHandler = getSocketHandler(SOCKET_EVENTS.COMMENTARY_UPDATE)
    act(() => { commentaryHandler(mockCommentary) })

    expect(screen.getByTestId('commentary-text')).toHaveTextContent(
      'ETH markets show strong upward momentum.',
    )
  })

  it('should update PairCard to latest price when multiple RATE_UPDATE events arrive', () => {
    render(
      <WithWebSocket>
        <PairCard pair="ETH/USDC" />
      </WithWebSocket>,
    )

    const rateHandler = getSocketHandler(SOCKET_EVENTS.RATE_UPDATE)
    act(() => { rateHandler(mockRate) })
    act(() => { rateHandler(updatedRate) })

    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,400.00')
  })

  it('should transition RateChart out of loading state when RATE_UPDATE socket event fires', () => {
    render(
      <WithWebSocket>
        <RateChart pair="ETH/USDC" />
      </WithWebSocket>,
    )
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()

    const rateHandler = getSocketHandler(SOCKET_EVENTS.RATE_UPDATE)
    act(() => { rateHandler(mockRate) })

    expect(screen.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
  })
})
