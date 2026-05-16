import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import { useEffect } from 'react'
import type { CurrencyPair, RateUpdate } from '@crypto/shared'
import { RateChart } from './RateChart'
import { useRatesStore } from '@features/rates/store/rates.store'
import { MAX_CHART_TICKS } from '@config/constants'

const generateTicks = (count: number, pair: CurrencyPair, basePrice: number): readonly RateUpdate[] =>
  Array.from({ length: count }, (_, i) => ({
    pair,
    price: basePrice + Math.sin(i * 0.3) * (basePrice * 0.02),
    timestamp: new Date(Date.now() - (count - i) * 2000).toISOString(),
    hourlyAverage: basePrice,
  }))

const withTicks = (ticks: readonly RateUpdate[]) => ({
  decorators: [
    (Story: StoryFn): JSX.Element => {
      useEffect((): (() => void) => {
        const { updateRate, reset } = useRatesStore.getState()
        ticks.forEach((t, i) => {
          setTimeout(() => { updateRate(t) }, i * 10)
        })
        return (): void => { reset() }
      }, [])
      return <Story />
    },
  ],
})

const meta: Meta<typeof RateChart> = {
  title: 'Widgets/RateChart',
  component: RateChart,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RateChart>

export const WithData: Story = {
  args: { pair: 'ETH/USDC' },
  ...withTicks(generateTicks(30, 'ETH/USDC', 2341.56)),
}
export const BTCPair: Story = {
  args: { pair: 'ETH/BTC' },
  ...withTicks(generateTicks(30, 'ETH/BTC', 0.052)),
}
export const Loading: Story = { args: { pair: 'ETH/USDC' } }
export const FullBuffer: Story = {
  args: { pair: 'ETH/USDC' },
  ...withTicks(generateTicks(MAX_CHART_TICKS, 'ETH/USDC', 2341.56)),
}
