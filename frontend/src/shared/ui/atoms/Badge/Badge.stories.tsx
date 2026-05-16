import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['connecting', 'connected', 'disconnected'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Connecting: Story = { args: { variant: 'connecting' } }
export const Connected: Story = { args: { variant: 'connected' } }
export const Disconnected: Story = { args: { variant: 'disconnected' } }
