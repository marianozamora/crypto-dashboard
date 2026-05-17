import { render, screen, act } from '@testing-library/react'
import { PairCard } from './PairCard'
import { useRatesStore } from '@features/rates/store/rates.store'
import {
  ETH_USDC_RATE,
  ETH_USDC_RATE_BELOW_AVG,
  ETH_BTC_RATE,
  EXPECTED_ETH_USDC_PRICE,
  EXPECTED_ETH_USDC_HOURLY_AVG,
  EXPECTED_CHANGE_ABOVE_AVG,
  EXPECTED_CHANGE_BELOW_AVG,
} from '@test-utils/fixtures'

vi.mock('recharts', async () => import('@test-utils/recharts.mock').then((m) => m.rechartsStubs))

const PAIR = 'ETH/USDC' as const
const PAIR_BTC = 'ETH/BTC' as const

describe('PairCard', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
  })

  it('should show skeleton when no rate data', () => {
    render(<PairCard pair={PAIR} />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()
  })

  it('should show formatted price when rate data available', () => {
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })
    render(<PairCard pair={PAIR} />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_ETH_USDC_PRICE)
  })

  it('should show pair label as card title when rendered', () => {
    render(<PairCard pair={PAIR} />)
    expect(screen.getByText('ETH / USDC')).toBeInTheDocument()
  })

  it('should show formatted hourly average value when rate data available', () => {
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })
    render(<PairCard pair={PAIR} />)
    expect(screen.getAllByTestId('stat-row-value')[0]).toHaveTextContent(EXPECTED_ETH_USDC_HOURLY_AVG)
  })

  it('should show positive percentage change with green color when price above average', () => {
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })
    render(<PairCard pair={PAIR} />)
    const changeCell = screen.getAllByTestId('stat-row-value')[1]
    expect(changeCell).toHaveTextContent(EXPECTED_CHANGE_ABOVE_AVG)
    expect(changeCell).toHaveClass('text-accent-green')
  })

  it('should show negative percentage change with red color when price below average', () => {
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE_BELOW_AVG) })
    render(<PairCard pair={PAIR} />)
    const changeCell = screen.getAllByTestId('stat-row-value')[1]
    expect(changeCell).toHaveTextContent(EXPECTED_CHANGE_BELOW_AVG)
    expect(changeCell).toHaveClass('text-accent-red')
  })

  it('should update price in DOM reactively when store receives rate update', () => {
    render(<PairCard pair={PAIR} />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })

    expect(screen.queryByTestId('price-tag-skeleton')).not.toBeInTheDocument()
    expect(screen.getByTestId('price-tag')).toHaveTextContent(EXPECTED_ETH_USDC_PRICE)
  })

  it('should transition mini chart from empty to visible when rate arrives', () => {
    render(<PairCard pair={PAIR} />)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })

    expect(screen.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
  })

  it('should have data-testid with pair identifier when rendered', () => {
    render(<PairCard pair={PAIR} />)
    expect(screen.getByTestId('pair-card-ETH-USDC')).toBeInTheDocument()
  })

  it('should use BTC symbol for ETH/BTC pair when rate data available', () => {
    act(() => { useRatesStore.getState().updateRate(ETH_BTC_RATE) })
    render(<PairCard pair={PAIR_BTC} />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('₿')
  })
})
