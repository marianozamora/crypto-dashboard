import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import type { ConnectionState } from '@crypto/shared'
import { ConnectionStatus } from './ConnectionStatus'
import { WebSocketContext } from '@app/providers/WebSocketProvider'

const withMockContext = (state: ConnectionState): { decorators: ((Story: StoryFn) => JSX.Element)[] } => ({
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <WebSocketContext.Provider value={{ connectionState: state }}>
        <Story />
      </WebSocketContext.Provider>
    ),
  ],
})

const meta: Meta<typeof ConnectionStatus> = {
  title: 'Widgets/ConnectionStatus',
  component: ConnectionStatus,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ConnectionStatus>

export const Connected: Story = { ...withMockContext('connected') }
export const Connecting: Story = { ...withMockContext('connecting') }
export const Disconnected: Story = { ...withMockContext('disconnected') }
