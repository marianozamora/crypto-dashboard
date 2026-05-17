import { render, screen, act } from '@testing-library/react'
import { SOCKET_EVENTS } from '@crypto/shared'
import { PairCard } from '@widgets/pair-card'
import { RateChart } from '@widgets/rate-chart'
import { CommentaryWidget } from '@widgets/commentary'
import { useWebSocket } from '@features/rates/hooks/useWebSocket'
import { useRatesStore } from '@features/rates/store/rates.store'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'
import {
  ETH_USDC_RATE,
  ETH_USDC_RATE_ABOVE_AVG,
  MOCK_COMMENTARY,
  EXPECTED_ETH_USDC_PRICE,
} from '@test-utils/fixtures'

vi.mock('recharts', async () => import('@test-utils/recharts.mock').then((m) => m.rechartsStubs))

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

const PAIR = 'ETH/USDC' as const
const EXPECTED_UPDATED_PRICE = '2,400.00'

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
    render(<PairCard pair={PAIR} />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })

    expect(screen.queryByTestId('price-tag-skeleton')).not.toBeInTheDocument()
    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_ETH_USDC_PRICE)
  })

  it('should reflect latest price when a second rate update arrives', () => {
    render(<PairCard pair={PAIR} />)
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })
    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_ETH_USDC_PRICE)

    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE_ABOVE_AVG) })
    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_UPDATED_PRICE)
  })

  it('should transition CommentaryWidget from loading to text when commentary arrives', () => {
    render(<CommentaryWidget />)
    expect(screen.getByTestId('commentary-loading')).toBeInTheDocument()

    act(() => { useCommentaryStore.getState().setCommentary(MOCK_COMMENTARY) })

    expect(screen.queryByTestId('commentary-loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('commentary-text')).toHaveTextContent(MOCK_COMMENTARY.text)
  })

  it('should transition RateChart from spinner to chart when first rate arrives', () => {
    render(<RateChart pair={PAIR} />)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })

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
    render(<WithWebSocket><PairCard pair={PAIR} /></WithWebSocket>)

    const rateHandler = getSocketHandler(SOCKET_EVENTS.RATE_UPDATE)
    act(() => { rateHandler(ETH_USDC_RATE) })

    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_ETH_USDC_PRICE)
  })

  it('should show commentary text in CommentaryWidget when COMMENTARY_UPDATE socket event fires', () => {
    render(<WithWebSocket><CommentaryWidget /></WithWebSocket>)

    const commentaryHandler = getSocketHandler(SOCKET_EVENTS.COMMENTARY_UPDATE)
    act(() => { commentaryHandler(MOCK_COMMENTARY) })

    expect(screen.getByTestId('commentary-text')).toHaveTextContent(MOCK_COMMENTARY.text)
  })

  it('should update PairCard to latest price when multiple RATE_UPDATE events arrive', () => {
    render(<WithWebSocket><PairCard pair={PAIR} /></WithWebSocket>)

    const rateHandler = getSocketHandler(SOCKET_EVENTS.RATE_UPDATE)
    act(() => { rateHandler(ETH_USDC_RATE) })
    act(() => { rateHandler(ETH_USDC_RATE_ABOVE_AVG) })

    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_UPDATED_PRICE)
  })

  it('should transition RateChart out of loading state when RATE_UPDATE socket event fires', () => {
    render(<WithWebSocket><RateChart pair={PAIR} /></WithWebSocket>)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()

    const rateHandler = getSocketHandler(SOCKET_EVENTS.RATE_UPDATE)
    act(() => { rateHandler(ETH_USDC_RATE) })

    expect(screen.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
  })
})
