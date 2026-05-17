import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('should render with default md size', () => {
    render(<Spinner />)
    expect(screen.getByTestId('spinner').className).toContain('w-6 h-6')
  })

  it('should render with sm size', () => {
    render(<Spinner size="sm" />)
    expect(screen.getByTestId('spinner').className).toContain('w-3 h-3')
  })

  it('should render with lg size', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByTestId('spinner').className).toContain('w-10 h-10')
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
