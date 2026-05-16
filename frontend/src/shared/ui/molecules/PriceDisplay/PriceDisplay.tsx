import { PriceTag } from '@atoms/PriceTag'
import { formatTimestamp } from '@lib/utils/format'

type PriceDisplayProps = {
  readonly price: number | null
  readonly timestamp: number | null
  readonly symbol?: string
  readonly size?: 'sm' | 'md' | 'lg'
}

const PriceDisplay = ({
  price,
  timestamp,
  symbol = '$',
  size = 'lg',
}: PriceDisplayProps): JSX.Element => (
  <div className="flex flex-col gap-1" data-testid="price-display">
    <PriceTag value={price} symbol={symbol} size={size} />
    <span className="text-white/30 text-xs font-mono" data-testid="price-timestamp">
      {formatTimestamp(timestamp)}
    </span>
  </div>
)

export { PriceDisplay, type PriceDisplayProps }
