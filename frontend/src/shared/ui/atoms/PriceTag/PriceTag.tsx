import { formatPrice } from '@lib/utils/format'

type PriceTagSize = 'sm' | 'md' | 'lg'

type PriceTagProps = {
  readonly value: number | null
  readonly symbol?: string
  readonly size?: PriceTagSize
}

const SIZE_CLASSES: Record<PriceTagSize, string> = {
  sm: 'text-sm font-mono font-medium',
  md: 'text-xl font-mono font-semibold',
  lg: 'text-3xl font-mono font-bold',
}

const SYMBOL_CLASSES: Record<PriceTagSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const SKELETON_CLASSES: Record<PriceTagSize, string> = {
  sm: 'h-4 w-20',
  md: 'h-6 w-28',
  lg: 'h-9 w-36',
}

const PriceTag = ({ value, symbol = '$', size = 'md' }: PriceTagProps): JSX.Element => {
  if (value === null) {
    return (
      <div
        className={`skeleton ${SKELETON_CLASSES[size]}`}
        data-testid="price-tag-skeleton"
        aria-label="Loading price"
      />
    )
  }

  const decimals = symbol === '₿' ? 6 : 2

  return (
    <span className={`text-white ${SIZE_CLASSES[size]}`} data-testid="price-tag">
      <span className={`text-white/25 mr-1 ${SYMBOL_CLASSES[size]}`}>{symbol}</span>
      {formatPrice(value, { decimals })}
    </span>
  )
}

export { PriceTag, type PriceTagProps, type PriceTagSize }
