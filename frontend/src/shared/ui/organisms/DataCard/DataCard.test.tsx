import { render, screen } from '@testing-library/react'
import { DataCard } from './DataCard'

describe('DataCard', () => {
  it('should render title', () => {
    render(<DataCard title="ETH / USDC"><p>content</p></DataCard>)
    expect(screen.getByText('ETH / USDC')).toBeInTheDocument()
  })

  it('should render children', () => {
    render(<DataCard title="ETH / USDC"><p>my content</p></DataCard>)
    expect(screen.getByText('my content')).toBeInTheDocument()
  })

  it('should render footer when provided', () => {
    render(
      <DataCard title="T" footer={<span>footer text</span>}>
        <p>content</p>
      </DataCard>,
    )
    expect(screen.getByText('footer text')).toBeInTheDocument()
  })

  it('should not render footer when not provided', () => {
    render(<DataCard title="T"><p>content</p></DataCard>)
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument()
  })

  it('should render headerRight when provided', () => {
    render(
      <DataCard title="T" headerRight={<span>Live</span>}>
        <p>content</p>
      </DataCard>,
    )
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('should have data-testid="data-card"', () => {
    render(<DataCard title="T"><p>content</p></DataCard>)
    expect(screen.getByTestId('data-card')).toBeInTheDocument()
  })
})
