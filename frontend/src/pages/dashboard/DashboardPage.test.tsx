import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'
import type { CurrencyPair } from '@crypto/shared'

vi.mock('@widgets/connection-status', () => ({
  ConnectionStatus: (): JSX.Element => (
    <div data-testid="connection-status">Connected</div>
  ),
}))

vi.mock('@widgets/pair-card', () => ({
  PairCard: ({ pair }: { pair: CurrencyPair }): JSX.Element => (
    <div data-testid={`pair-card-${pair.replace('/', '-')}`}>{pair}</div>
  ),
}))

vi.mock('@widgets/commentary', () => ({
  CommentaryWidget: (): JSX.Element => (
    <div data-testid="commentary-widget">Commentary</div>
  ),
}))

describe('DashboardPage', () => {
  it('should render app title', () => {
    render(<DashboardPage />)
    expect(screen.getByText('cryptostream')).toBeInTheDocument()
  })

  it('should render connection status', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('connection-status')).toBeInTheDocument()
  })

  it('should render a card for each currency pair', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('pair-card-ETH-USDC')).toBeInTheDocument()
    expect(screen.getByTestId('pair-card-ETH-USDT')).toBeInTheDocument()
    expect(screen.getByTestId('pair-card-ETH-BTC')).toBeInTheDocument()
  })

  it('should render commentary section', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('commentary-widget')).toBeInTheDocument()
  })
})
