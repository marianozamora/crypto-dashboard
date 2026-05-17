import { render, screen, act } from '@testing-library/react'
import { RateChart } from './RateChart'
import { useRatesStore } from '@features/rates/store/rates.store'
import {
  ETH_USDC_RATE,
  ETH_USDC_RATE_TICK_2,
} from '@test-utils/fixtures'

vi.mock('recharts', async () => import('@test-utils/recharts.mock').then((m) => m.rechartsStubs))

const PAIR = 'ETH/USDC' as const
const PAIR_BTC = 'ETH/BTC' as const

describe('RateChart', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
  })

  it('should show spinner while no data', () => {
    render(<RateChart pair={PAIR} />)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()
  })

  it('should transition from spinner to chart reactively when rate arrives', () => {
    render(<RateChart pair={PAIR} />)
    expect(screen.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()

    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })

    expect(screen.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
  })

  it('should remain visible after multiple rate updates without remounting', () => {
    render(<RateChart pair={PAIR} />)
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE) })
    act(() => { useRatesStore.getState().updateRate(ETH_USDC_RATE_TICK_2) })
    expect(screen.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument()
    expect(screen.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
  })

  it('should show pair label in card title when rendered', () => {
    render(<RateChart pair={PAIR} />)
    expect(screen.getByText('ETH / USDC Chart')).toBeInTheDocument()
  })

  it('should show BTC pair label for ETH/BTC when rendered', () => {
    render(<RateChart pair={PAIR_BTC} />)
    expect(screen.getByText('ETH / BTC Chart')).toBeInTheDocument()
  })
})
