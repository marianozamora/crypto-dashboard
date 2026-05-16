import { render, screen } from '@testing-library/react'
import { PriceDisplay } from './PriceDisplay'

describe('PriceDisplay', () => {
  it('should render price and timestamp when both provided', () => {
    render(<PriceDisplay price={2341.56} timestamp={1705312800000} />)
    expect(screen.getByTestId('price-tag')).toBeInTheDocument()
    expect(screen.getByTestId('price-timestamp')).not.toHaveTextContent('—')
  })

  it('should render skeleton when price is null', () => {
    render(<PriceDisplay price={null} timestamp={null} />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()
  })

  it('should show — when timestamp is null', () => {
    render(<PriceDisplay price={2341.56} timestamp={null} />)
    expect(screen.getByTestId('price-timestamp')).toHaveTextContent('—')
  })

  it('should pass symbol to PriceTag', () => {
    render(<PriceDisplay price={0.05} timestamp={null} symbol="₿" />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('₿')
  })

  it('should have data-testid="price-display"', () => {
    render(<PriceDisplay price={null} timestamp={null} />)
    expect(screen.getByTestId('price-display')).toBeInTheDocument()
  })

  it('should have data-testid="price-timestamp"', () => {
    render(<PriceDisplay price={null} timestamp={null} />)
    expect(screen.getByTestId('price-timestamp')).toBeInTheDocument()
  })
})
