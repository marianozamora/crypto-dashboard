import { useState, useEffect } from 'react'
import type { CurrencyPair, RateUpdate } from '@crypto/shared'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DataCard } from '@organisms/DataCard'
import { Spinner } from '@atoms/Spinner'
import { useRates } from '@features/rates/hooks/useRates'
import { PAIR_LABELS, PAIR_CURRENCY_SYMBOLS, MAX_CHART_TICKS } from '@config/constants'
import { formatChartTime, formatPrice } from '@lib/utils/format'

type RateChartProps = {
  readonly pair: CurrencyPair
}

type ChartDataPoint = {
  readonly timestamp: number
  readonly price: number
  readonly time: string
}

const buildDataPoint = (rate: RateUpdate): ChartDataPoint => {
  const ts = new Date(rate.timestamp).getTime()
  return { timestamp: ts, price: rate.price, time: formatChartTime(ts) }
}

const appendTick = (
  prev: readonly ChartDataPoint[],
  newPoint: ChartDataPoint,
): readonly ChartDataPoint[] => {
  const updated = [...prev, newPoint]
  return updated.length > MAX_CHART_TICKS ? updated.slice(-MAX_CHART_TICKS) : updated
}

type TooltipPayload = { readonly value: number }

type CustomTooltipProps = {
  readonly active?: boolean
  readonly payload?: readonly TooltipPayload[]
  readonly label?: string
  readonly symbol: string
}

const CustomTooltip = ({ active, payload, label, symbol }: CustomTooltipProps): JSX.Element | null => {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value ?? 0
  return (
    <div className="bg-surface-elevated border border-white/10 rounded p-2 text-xs">
      <p className="text-white/50">{label}</p>
      <p className="text-white font-mono">{symbol}{formatPrice(value)}</p>
    </div>
  )
}

const RateChart = ({ pair }: RateChartProps): JSX.Element => {
  const [data, setData] = useState<readonly ChartDataPoint[]>([])
  const { getRateForPair } = useRates()
  const rate = getRateForPair(pair)
  const symbol = PAIR_CURRENCY_SYMBOLS[pair] ?? '$'

  useEffect((): void => {
    if (rate === null) return
    setData((prev) => appendTick(prev, buildDataPoint(rate)))
  }, [rate])

  if (data.length === 0) {
    return (
      <DataCard title={`${PAIR_LABELS[pair] ?? pair} Chart`}>
        <div
          className="flex items-center justify-center h-40"
          data-testid={`chart-loading-${pair.replace('/', '-')}`}
        >
          <Spinner size="md" />
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard title={`${PAIR_LABELS[pair] ?? pair} Chart`}>
      <div className="h-40" data-testid={`rate-chart-${pair.replace('/', '-')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...data]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              tickFormatter={(v: number): string => formatPrice(v)}
              width={70}
            />
            <Tooltip content={<CustomTooltip symbol={symbol} />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4da6ff"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}

export { RateChart, type RateChartProps }
