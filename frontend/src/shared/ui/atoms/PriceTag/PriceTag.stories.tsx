import type { Meta, StoryObj } from '@storybook/react'
import { PriceTag } from './PriceTag'

const meta: Meta<typeof PriceTag> = {
  title: 'Atoms/PriceTag',
  component: PriceTag,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PriceTag>

export const WithUSDValue: Story = { args: { value: 2341.56, symbol: '$', size: 'md' } }
export const WithBTCValue: Story = { args: { value: 0.052134, symbol: '₿', size: 'md' } }
export const Large: Story = { args: { value: 2341.56, symbol: '$', size: 'lg' } }
export const Small: Story = { args: { value: 2341.56, symbol: '$', size: 'sm' } }
export const Loading: Story = { args: { value: null, symbol: '$' } }
