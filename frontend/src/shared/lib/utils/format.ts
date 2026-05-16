type FormatPriceOptions = {
  readonly currency?: string
  readonly decimals?: number
}

const formatPrice = (value: number | null, options: FormatPriceOptions = {}): string => {
  if (value === null) return '—'
  const { decimals = 2 } = options
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

const formatTimestamp = (timestamp: number | null): string => {
  if (timestamp === null) return '—'
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

const formatPercent = (value: number | null): string => {
  if (value === null) return '—'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

const formatChartTime = (timestamp: number): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))

export { formatPrice, formatTimestamp, formatPercent, formatChartTime, type FormatPriceOptions }
