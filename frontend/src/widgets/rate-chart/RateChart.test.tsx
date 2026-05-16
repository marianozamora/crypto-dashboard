import { render, screen, act } from '@testing-library/react'
import { RateChart } from './RateChart'
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

describe('RateChart', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
  })

  it('should show spinner while no data', () => {
    render(<RateChart pair="ETH/USDC" />)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()
  })

  it('should show chart after receiving rate data', () => {
    const { rerender } = render(<RateChart pair="ETH/USDC" />)
    act(() => { useRatesStore.getState().updateRate(mockRate) })
    rerender(<RateChart pair="ETH/USDC" />)
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
  })

  it('should show pair label in card title', () => {
    render(<RateChart pair="ETH/USDC" />)
    expect(screen.getByText('ETH / USDC Chart')).toBeInTheDocument()
  })

  it('should show BTC pair label for ETH/BTC', () => {
    render(<RateChart pair="ETH/BTC" />)
    expect(screen.getByText('ETH / BTC Chart')).toBeInTheDocument()
  })
})
