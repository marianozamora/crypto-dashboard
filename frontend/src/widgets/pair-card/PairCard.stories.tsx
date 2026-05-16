import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import { useEffect } from 'react'
import type { RateUpdate } from '@crypto/shared'
import { PairCard } from './PairCard'
import { useRatesStore } from '@features/rates/store/rates.store'

const withRate = (rate: RateUpdate | null): { decorators: ((Story: StoryFn) => JSX.Element)[] } => ({
  decorators: [
    (Story: StoryFn): JSX.Element => {
      useEffect((): (() => void) => {
        if (rate !== null) useRatesStore.getState().updateRate(rate)
        return (): void => { useRatesStore.getState().reset() }
      }, [])
      return <Story />
    },
  ],
})

const base = {
  pair: 'ETH/USDC' as const,
  timestamp: new Date().toISOString(),
  hourlyAverage: 2310.0,
}

const meta: Meta<typeof PairCard> = {
  title: 'Widgets/PairCard',
  component: PairCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PairCard>

export const LiveData: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...base, price: 2341.56 }),
}
export const PriceAboveAverage: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...base, price: 2400.0 }),
}
export const PriceBelowAverage: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...base, price: 2200.0 }),
}
export const BTCPair: Story = {
  args: { pair: 'ETH/BTC' },
  ...withRate({ pair: 'ETH/BTC', price: 0.052134, timestamp: base.timestamp, hourlyAverage: 0.0519 }),
}
export const Loading: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate(null),
}
