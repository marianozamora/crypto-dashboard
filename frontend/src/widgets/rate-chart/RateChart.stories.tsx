import type { Meta, StoryObj } from '@storybook/react'
import { RateChart } from './RateChart'
import { withTicks, generateTicks } from '@test-utils/storybook.decorators'
import { ETH_USDC_PRICE, ETH_BTC_PRICE } from '@test-utils/fixtures'
import { MAX_CHART_TICKS } from '@config/constants'

const meta: Meta<typeof RateChart> = {
  title: 'Widgets/RateChart',
  component: RateChart,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RateChart>

export const WithData: Story = {
  args: { pair: 'ETH/USDC' },
  ...withTicks(generateTicks(30, 'ETH/USDC', ETH_USDC_PRICE)),
}
export const BTCPair: Story = {
  args: { pair: 'ETH/BTC' },
  ...withTicks(generateTicks(30, 'ETH/BTC', ETH_BTC_PRICE)),
}
export const Loading: Story = { args: { pair: 'ETH/USDC' } }
export const FullBuffer: Story = {
  args: { pair: 'ETH/USDC' },
  ...withTicks(generateTicks(MAX_CHART_TICKS, 'ETH/USDC', ETH_USDC_PRICE)),
}
