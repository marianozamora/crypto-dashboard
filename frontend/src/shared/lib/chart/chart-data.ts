import type { RateUpdate } from '@crypto/shared'
import { MAX_CHART_TICKS } from '@config/constants'
import { formatChartTime } from '@lib/utils/format'

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

export { buildDataPoint, appendTick }
export type { ChartDataPoint }
