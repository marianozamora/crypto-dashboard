import type { Meta, StoryObj } from '@storybook/react'
import { PriceDisplay } from './PriceDisplay'

const meta: Meta<typeof PriceDisplay> = {
  title: 'Molecules/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PriceDisplay>

export const WithData: Story = { args: { price: 2341.56, timestamp: Date.now(), symbol: '$' } }
export const WithBTC: Story = { args: { price: 0.052134, timestamp: Date.now(), symbol: '₿' } }
export const Loading: Story = { args: { price: null, timestamp: null, symbol: '$' } }
export const NoTimestamp: Story = { args: { price: 2341.56, timestamp: null, symbol: '$' } }
