import { render, screen } from '@testing-library/react'
import { ErrorFallback } from './ErrorFallback'

describe('ErrorFallback', () => {
  it('should render default message when none provided', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should render custom message when provided', () => {
    render(<ErrorFallback message="Failed to load chart" />)
    expect(screen.getByText('Failed to load chart')).toBeInTheDocument()
  })

  it('should render warning icon', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('⚠')).toBeInTheDocument()
  })
})
