import type { Meta, StoryObj } from '@storybook/react'
import { PriceDisplay } from './PriceDisplay'
import { ETH_USDC_PRICE, ETH_BTC_PRICE } from '@test-utils/fixtures'

const meta: Meta<typeof PriceDisplay> = {
  title: 'Molecules/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PriceDisplay>

export const WithData: Story = { args: { price: ETH_USDC_PRICE, timestamp: Date.now(), symbol: '$' } }
export const WithBTC: Story = { args: { price: ETH_BTC_PRICE, timestamp: Date.now(), symbol: '₿' } }
export const Loading: Story = { args: { price: null, timestamp: null, symbol: '$' } }
export const NoTimestamp: Story = { args: { price: ETH_USDC_PRICE, timestamp: null, symbol: '$' } }
