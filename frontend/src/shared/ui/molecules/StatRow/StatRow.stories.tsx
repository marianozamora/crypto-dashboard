import type { Meta, StoryObj } from '@storybook/react'
import { StatRow } from './StatRow'

const meta: Meta<typeof StatRow> = {
  title: 'Molecules/StatRow',
  component: StatRow,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof StatRow>

export const WithValue: Story = { args: { label: 'Hourly Average', value: '$2,310.00' } }
export const NullValue: Story = { args: { label: 'Hourly Average', value: null } }
export const PositiveChange: Story = {
  args: { label: '24h Change', value: '+1.35%', valueClassName: 'text-accent-green' },
}
export const NegativeChange: Story = {
  args: { label: '24h Change', value: '-2.10%', valueClassName: 'text-accent-red' },
}
