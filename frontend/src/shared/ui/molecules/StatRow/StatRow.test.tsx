import { render, screen } from '@testing-library/react'
import { StatRow } from './StatRow'

describe('StatRow', () => {
  it('should render label and value', () => {
    render(<StatRow label="Hourly Average" value="$2,310.00" />)
    expect(screen.getByText('Hourly Average')).toBeInTheDocument()
    expect(screen.getByTestId('stat-row-value')).toHaveTextContent('$2,310.00')
  })

  it('should show N/A when value is null', () => {
    render(<StatRow label="Hourly Average" value={null} />)
    expect(screen.getByTestId('stat-row-value')).toHaveTextContent('N/A')
  })

  it('should apply custom valueClassName', () => {
    render(<StatRow label="Change" value="+1.35%" valueClassName="text-accent-green" />)
    expect(screen.getByTestId('stat-row-value').className).toContain('text-accent-green')
  })

  it('should have data-testid="stat-row"', () => {
    render(<StatRow label="Label" value="Value" />)
    expect(screen.getByTestId('stat-row')).toBeInTheDocument()
  })

  it('should have data-testid="stat-row-value"', () => {
    render(<StatRow label="Label" value="Value" />)
    expect(screen.getByTestId('stat-row-value')).toBeInTheDocument()
  })
})
