import { useState, useEffect } from 'react'
import type { CurrencyPair, RateUpdate } from '@crypto/shared'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { DataCard } from '@organisms/DataCard'
import { Spinner } from '@atoms/Spinner'
import { ChartTooltip } from '@molecules/ChartTooltip'
import { useRates } from '@features/rates/hooks/useRates'
import {
  PAIR_LABELS, PAIR_CURRENCY_SYMBOLS, MAX_CHART_TICKS,
  CHART_LINE_COLOR, CHART_LINE_STROKE_WIDTH,
  CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_AXIS_FONT_SIZE, CHART_Y_AXIS_WIDTH,
} from '@config/constants'
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
  next: ChartDataPoint,
): readonly ChartDataPoint[] => {
  const updated = [...prev, next]
  return updated.length > MAX_CHART_TICKS ? updated.slice(-MAX_CHART_TICKS) : updated
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
          className="flex items-center justify-center h-[200px]"
          data-testid={`chart-loading-${pair.replace('/', '-')}`}
        >
          <Spinner size="md" />
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard title={`${PAIR_LABELS[pair] ?? pair} Chart`}>
      <div className="h-[200px]" data-testid={`rate-chart-${pair.replace('/', '-')}`}>
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
    </DataCard>
  )
}

export { RateChart, type RateChartProps }
