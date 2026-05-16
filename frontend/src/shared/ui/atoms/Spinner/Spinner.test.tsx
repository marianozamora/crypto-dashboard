import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('should render with default md size', () => {
    render(<Spinner />)
    expect(screen.getByTestId('spinner').className).toContain('w-8 h-8')
  })

  it('should render with sm size', () => {
    render(<Spinner size="sm" />)
    expect(screen.getByTestId('spinner').className).toContain('w-4 h-4')
  })

  it('should render with lg size', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByTestId('spinner').className).toContain('w-12 h-12')
  })

  it('should have role="status"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have data-testid="spinner"', () => {
    render(<Spinner />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should have aria-label="Loading"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })
})
