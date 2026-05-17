import { useState, useEffect } from 'react'
import type { CurrencyPair } from '@crypto/shared'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { DataCard } from '@organisms/DataCard'
import { PriceDisplay } from '@molecules/PriceDisplay'
import { StatRow } from '@molecules/StatRow'
import { ChartTooltip } from '@molecules/ChartTooltip'
import { useRates } from '@features/rates/hooks/useRates'
import {
  PAIR_LABELS, PAIR_CURRENCY_SYMBOLS,
  CHART_LINE_COLOR, CHART_LINE_STROKE_WIDTH,
  CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_AXIS_FONT_SIZE, CHART_Y_AXIS_WIDTH,
} from '@config/constants'
import { formatPrice, formatPercent } from '@lib/utils/format'
import { buildDataPoint, appendTick } from '@lib/chart/chart-data'
import type { ChartDataPoint } from '@lib/chart/chart-data'

type PairCardProps = {
  readonly pair: CurrencyPair
}

const buildHourlyAverageLabel = (pair: CurrencyPair, avg: number | null): string | null => {
  if (avg === null) return null
  const symbol = PAIR_CURRENCY_SYMBOLS[pair] ?? '$'
  return `${symbol}${formatPrice(avg)}`
}

const buildChangeLabel = (price: number | null, avg: number | null): string | null => {
  if (price === null || avg === null) return null
  return formatPercent(((price - avg) / avg) * 100)
}

const buildChangeClassName = (price: number | null, avg: number | null): string => {
  if (price === null || avg === null) return 'text-white'
  return price >= avg ? 'text-accent-green' : 'text-accent-red'
}

type InlineMiniChartProps = {
  readonly pair: CurrencyPair
  readonly data: readonly ChartDataPoint[]
}

const EmptyChart = ({ pair }: { readonly pair: CurrencyPair }): JSX.Element => (
  <div
    className="h-[120px] flex items-center justify-center"
    data-testid={`chart-loading-${pair.replace('/', '-')}`}
  >
    <span className="text-white/10 text-xs font-mono">waiting for data</span>
  </div>
)

const FilledChart = ({ data, symbol, pair }: {
  readonly data: readonly ChartDataPoint[]
  readonly symbol: string
  readonly pair: CurrencyPair
}): JSX.Element => (
  <div className="h-[120px]" data-testid={`rate-chart-${pair.replace('/', '-')}`}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={[...data]}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis dataKey="time" tick={{ fill: CHART_AXIS_COLOR, fontSize: CHART_AXIS_FONT_SIZE }} interval="preserveStartEnd" />
        <YAxis orientation="right" domain={['auto', 'auto']} tick={{ fill: CHART_AXIS_COLOR, fontSize: CHART_AXIS_FONT_SIZE }} tickFormatter={(v: number): string => formatPrice(v)} width={CHART_Y_AXIS_WIDTH} />
        <Tooltip content={<ChartTooltip symbol={symbol} />} />
        <Line type="monotone" dataKey="price" stroke={CHART_LINE_COLOR} strokeWidth={CHART_LINE_STROKE_WIDTH} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

const InlineMiniChart = ({ pair, data }: InlineMiniChartProps): JSX.Element => {
  const symbol = PAIR_CURRENCY_SYMBOLS[pair] ?? '$'
  if (data.length === 0) return <EmptyChart pair={pair} />
  return <FilledChart data={data} symbol={symbol} pair={pair} />
}

const LiveDot = ({ active }: { readonly active: boolean }): JSX.Element => (
  <span
    className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-accent-green animate-pulse' : 'bg-white/10'}`}
  />
)

const PairCard = ({ pair }: PairCardProps): JSX.Element => {
  const [ticks, setTicks] = useState<readonly ChartDataPoint[]>([])
  const { getRateForPair } = useRates()
  const rate = getRateForPair(pair)
  const price = rate?.price ?? null
  const timestamp = rate !== null ? new Date(rate.timestamp).getTime() : null
  const hourlyAverage = rate?.hourlyAverage ?? null
  const symbol = PAIR_CURRENCY_SYMBOLS[pair] ?? '$'

  useEffect((): void => {
    if (rate === null) return
    setTicks((prev) => appendTick(prev, buildDataPoint(rate)))
  }, [rate])

  return (
    <DataCard
      title={PAIR_LABELS[pair] ?? pair}
      headerRight={<LiveDot active={price !== null} />}
    >
      <div data-testid={`pair-card-${pair.replace('/', '-')}`}>
        <PriceDisplay price={price} timestamp={timestamp} symbol={symbol} size="lg" />
      </div>

      <div className="border-t border-white/5 pt-3 -mx-5 px-5">
        <InlineMiniChart pair={pair} data={ticks} />
      </div>

      <div className="border-t border-white/5 -mx-5 px-5 pt-1">
        <StatRow label="1h Avg" value={buildHourlyAverageLabel(pair, hourlyAverage)} />
        <StatRow
          label="vs Avg"
          value={buildChangeLabel(price, hourlyAverage)}
          valueClassName={buildChangeClassName(price, hourlyAverage)}
        />
      </div>
    </DataCard>
  )
}

export { PairCard, type PairCardProps }
