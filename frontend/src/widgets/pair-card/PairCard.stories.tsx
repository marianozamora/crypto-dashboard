import type { Meta, StoryObj } from '@storybook/react'
import { PairCard } from './PairCard'
import { withRate } from '@test-utils/storybook.decorators'
import {
  ETH_USDC_RATE,
  ETH_USDC_RATE_ABOVE_AVG,
  ETH_USDC_RATE_BELOW_AVG,
  ETH_BTC_RATE,
} from '@test-utils/fixtures'

const meta: Meta<typeof PairCard> = {
  title: 'Widgets/PairCard',
  component: PairCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PairCard>

export const LiveData: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...ETH_USDC_RATE, timestamp: new Date().toISOString() }),
}
export const PriceAboveAverage: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...ETH_USDC_RATE_ABOVE_AVG, timestamp: new Date().toISOString() }),
}
export const PriceBelowAverage: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...ETH_USDC_RATE_BELOW_AVG, timestamp: new Date().toISOString() }),
}
export const BTCPair: Story = {
  args: { pair: 'ETH/BTC' },
  ...withRate({ ...ETH_BTC_RATE, timestamp: new Date().toISOString() }),
}
export const Loading: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate(null),
}
