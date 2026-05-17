import type { Meta, StoryObj } from '@storybook/react'
import { PriceTag } from './PriceTag'
import { ETH_USDC_PRICE, ETH_BTC_PRICE } from '@test-utils/fixtures'

const meta: Meta<typeof PriceTag> = {
  title: 'Atoms/PriceTag',
  component: PriceTag,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PriceTag>

export const WithUSDValue: Story = { args: { value: ETH_USDC_PRICE, symbol: '$', size: 'md' } }
export const WithBTCValue: Story = { args: { value: ETH_BTC_PRICE, symbol: '₿', size: 'md' } }
export const Large: Story = { args: { value: ETH_USDC_PRICE, symbol: '$', size: 'lg' } }
export const Small: Story = { args: { value: ETH_USDC_PRICE, symbol: '$', size: 'sm' } }
export const Loading: Story = { args: { value: null, symbol: '$' } }
