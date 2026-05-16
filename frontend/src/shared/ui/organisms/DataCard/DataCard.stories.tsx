import type { Meta, StoryObj } from '@storybook/react'
import { DataCard } from './DataCard'

const meta: Meta<typeof DataCard> = {
  title: 'Organisms/DataCard',
  component: DataCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DataCard>

export const Basic: Story = {
  args: { title: 'ETH / USDC', children: <p className="text-white/60">Content here</p> },
}
export const WithFooter: Story = {
  args: {
    title: 'ETH / USDC',
    children: <p className="text-white/60">Content</p>,
    footer: <p className="text-white/30 text-xs">Updated 2s ago</p>,
  },
}
export const WithHeaderRight: Story = {
  args: {
    title: 'ETH / USDC',
    children: <p className="text-white/60">Content</p>,
    headerRight: <span className="text-accent-green text-xs">Live</span>,
  },
}
