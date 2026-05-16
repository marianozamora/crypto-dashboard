import type { CurrencyPair } from '@crypto/shared'
import { DataCard } from '@organisms/DataCard'
import { PriceDisplay } from '@molecules/PriceDisplay'
import { StatRow } from '@molecules/StatRow'
import { useRates } from '@features/rates/hooks/useRates'
import { PAIR_LABELS, PAIR_CURRENCY_SYMBOLS } from '@config/constants'
import { formatPrice, formatPercent } from '@lib/utils/format'

type PairCardProps = {
  readonly pair: CurrencyPair
}

const buildHourlyAverageLabel = (pair: CurrencyPair, hourlyAverage: number | null): string | null => {
  if (hourlyAverage === null) return null
  const symbol = PAIR_CURRENCY_SYMBOLS[pair]
  return `${symbol}${formatPrice(hourlyAverage)}`
}

const buildChangeLabel = (price: number | null, hourlyAverage: number | null): string | null => {
  if (price === null || hourlyAverage === null) return null
  return formatPercent(((price - hourlyAverage) / hourlyAverage) * 100)
}

const buildChangeClassName = (price: number | null, hourlyAverage: number | null): string => {
  if (price === null || hourlyAverage === null) return 'text-white'
  return price >= hourlyAverage ? 'text-accent-green' : 'text-accent-red'
}

const PairCard = ({ pair }: PairCardProps): JSX.Element => {
  const { getRateForPair } = useRates()
  const rate = getRateForPair(pair)
  const price = rate?.price ?? null
  const timestamp = rate !== null ? new Date(rate.timestamp).getTime() : null
  const hourlyAverage = rate?.hourlyAverage ?? null
  const symbol = PAIR_CURRENCY_SYMBOLS[pair]

  return (
    <DataCard title={PAIR_LABELS[pair]}>
      <div data-testid={`pair-card-${pair.replace('/', '-')}`}>
        <PriceDisplay price={price} timestamp={timestamp} symbol={symbol} size="lg" />
        <div className="mt-4 flex flex-col gap-1 border-t border-white/5 pt-3">
          <StatRow label="Hourly Average" value={buildHourlyAverageLabel(pair, hourlyAverage)} />
          <StatRow
            label="vs Average"
            value={buildChangeLabel(price, hourlyAverage)}
            valueClassName={buildChangeClassName(price, hourlyAverage)}
          />
        </div>
      </div>
    </DataCard>
  )
}

export { PairCard, type PairCardProps }
