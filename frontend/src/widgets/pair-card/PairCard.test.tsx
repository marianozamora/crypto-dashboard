import { render, screen, act } from '@testing-library/react'
import { PairCard } from './PairCard'
import { useRatesStore } from '@features/rates/store/rates.store'
import type { RateUpdate } from '@crypto/shared'

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

const mockRate: RateUpdate = {
  pair: 'ETH/USDC',
  price: 2341.56,
  timestamp: '2025-01-15T10:30:00.000Z',
  hourlyAverage: 2310.0,
}

describe('PairCard', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
  })

  it('should show skeleton when no rate data', () => {
    render(<PairCard pair="ETH/USDC" />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()
  })

  it('should show price when rate data available', () => {
    act(() => { useRatesStore.getState().updateRate(mockRate) })
    render(<PairCard pair="ETH/USDC" />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,341.56')
  })

  it('should show pair label as card title', () => {
    render(<PairCard pair="ETH/USDC" />)
    expect(screen.getByText('ETH / USDC')).toBeInTheDocument()
  })

  it('should show hourly average when data available', () => {
    act(() => { useRatesStore.getState().updateRate(mockRate) })
    render(<PairCard pair="ETH/USDC" />)
    expect(screen.getByText('1h Avg')).toBeInTheDocument()
  })

  it('should have data-testid with pair identifier', () => {
    render(<PairCard pair="ETH/USDC" />)
    expect(screen.getByTestId('pair-card-ETH-USDC')).toBeInTheDocument()
  })

  it('should use BTC symbol for ETH/BTC pair', () => {
    const btcRate: RateUpdate = { ...mockRate, pair: 'ETH/BTC', price: 0.052134, hourlyAverage: 0.051 }
    act(() => { useRatesStore.getState().updateRate(btcRate) })
    render(<PairCard pair="ETH/BTC" />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('₿')
  })
})
