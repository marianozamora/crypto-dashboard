import { formatPrice } from '@lib/utils/format'

type PriceTagSize = 'sm' | 'md' | 'lg'

type PriceTagProps = {
  readonly value: number | null
  readonly symbol?: string
  readonly size?: PriceTagSize
}

const SIZE_CLASSES: Record<PriceTagSize, string> = {
  sm: 'text-sm font-mono',
  md: 'text-xl font-mono font-semibold',
  lg: 'text-3xl font-mono font-bold',
}

const PriceTag = ({ value, symbol = '$', size = 'md' }: PriceTagProps): JSX.Element => {
  if (value === null) {
    return (
      <div
        className={`skeleton h-7 w-32 ${SIZE_CLASSES[size]}`}
        data-testid="price-tag-skeleton"
        aria-label="Loading price"
      />
    )
  }

  const decimals = symbol === '₿' ? 6 : 2

  return (
    <span className={`text-white ${SIZE_CLASSES[size]}`} data-testid="price-tag">
      <span className="text-white/40 text-sm mr-1">{symbol}</span>
      {formatPrice(value, { decimals })}
    </span>
  )
}

export { PriceTag, type PriceTagProps, type PriceTagSize }
