import { PriceTag } from '@atoms/PriceTag'
import { formatTimestamp } from '@lib/utils/format'

type PriceDisplayProps = {
  readonly price: number | null
  readonly timestamp: number | null
  readonly symbol?: string
  readonly size?: 'sm' | 'md' | 'lg'
}

const PriceDisplay = ({ price, timestamp, symbol, size }: PriceDisplayProps): JSX.Element => (
  <div className="flex flex-col gap-0.5" data-testid="price-display">
    <PriceTag value={price} symbol={symbol} size={size} />
    <span
      className="text-xs font-mono text-white/25 tabular-nums"
      data-testid="price-timestamp"
    >
      {formatTimestamp(timestamp)}
    </span>
  </div>
)

export { PriceDisplay, type PriceDisplayProps }
