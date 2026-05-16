import { formatPrice, formatTimestamp, formatPercent, formatChartTime } from './format'

describe('formatPrice', () => {
  it('should format positive number with 2 decimals', () => {
    expect(formatPrice(3000)).toBe('3,000.00')
  })

  it('should return — when value is null', () => {
    expect(formatPrice(null)).toBe('—')
  })

  it('should respect custom decimals option', () => {
    expect(formatPrice(0.05123, { decimals: 5 })).toBe('0.05123')
  })

  it('should handle large numbers correctly', () => {
    expect(formatPrice(1_234_567.89)).toBe('1,234,567.89')
  })
})

describe('formatTimestamp', () => {
  it('should format timestamp as HH:mm:ss', () => {
    const ts = new Date('2025-01-15T10:30:45.000Z').getTime()
    const result = formatTimestamp(ts)
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/)
  })

  it('should return — when timestamp is null', () => {
    expect(formatTimestamp(null)).toBe('—')
  })
})

describe('formatPercent', () => {
  it('should prefix positive values with +', () => {
    expect(formatPercent(3.45)).toBe('+3.45%')
  })

  it('should not double-prefix negative values', () => {
    expect(formatPercent(-1.5)).toBe('-1.50%')
  })

  it('should return — when value is null', () => {
    expect(formatPercent(null)).toBe('—')
  })

  it('should show 2 decimal places', () => {
    expect(formatPercent(0)).toBe('+0.00%')
  })
})

describe('formatChartTime', () => {
  it('should format timestamp as HH:mm:ss', () => {
    const ts = new Date('2025-01-15T10:30:45.000Z').getTime()
    expect(formatChartTime(ts)).toMatch(/\d{2}:\d{2}:\d{2}/)
  })

  it('should return a string', () => {
    expect(typeof formatChartTime(Date.now())).toBe('string')
  })
})
