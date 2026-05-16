import { render, screen } from '@testing-library/react'
import { PriceTag } from './PriceTag'

describe('PriceTag', () => {
  it('should render formatted price when value provided', () => {
    render(<PriceTag value={2341.56} />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('2,341.56')
  })

  it('should render skeleton when value is null', () => {
    render(<PriceTag value={null} />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()
  })

  it('should render currency symbol', () => {
    render(<PriceTag value={100} symbol="€" />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('€')
  })

  it('should use 6 decimals for BTC symbol', () => {
    render(<PriceTag value={0.052134} symbol="₿" />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('0.052134')
  })

  it('should use 2 decimals for USD symbol', () => {
    render(<PriceTag value={3000} symbol="$" />)
    expect(screen.getByTestId('price-tag')).toHaveTextContent('3,000.00')
  })

  it('should apply correct size class for lg', () => {
    render(<PriceTag value={100} size="lg" />)
    expect(screen.getByTestId('price-tag').className).toContain('text-3xl')
  })

  it('should have data-testid="price-tag" when value provided', () => {
    render(<PriceTag value={100} />)
    expect(screen.getByTestId('price-tag')).toBeInTheDocument()
  })

  it('should have data-testid="price-tag-skeleton" when null', () => {
    render(<PriceTag value={null} />)
    expect(screen.getByTestId('price-tag-skeleton')).toBeInTheDocument()
  })
})
