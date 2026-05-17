import { formatPrice } from '@lib/utils/format'

type TooltipPayload = { readonly value: number }

type ChartTooltipProps = {
  readonly active?: boolean
  readonly payload?: readonly TooltipPayload[]
  readonly label?: string
  readonly symbol: string
}

const ChartTooltip = ({ active, payload, label, symbol }: ChartTooltipProps): JSX.Element | null => {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value ?? 0
  return (
    <div className="bg-surface-elevated border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-white/50 font-mono">{label}</p>
      <p className="text-white font-mono">{symbol}{formatPrice(value)}</p>
    </div>
  )
}

export { ChartTooltip, type ChartTooltipProps }
