import type { Meta, StoryObj, StoryFn } from '@storybook/react'
import { useEffect } from 'react'
import type { MarketCommentary } from '@crypto/shared'
import { CommentaryWidget } from './CommentaryWidget'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'

const withCommentary = (commentary: MarketCommentary | null): { decorators: ((Story: StoryFn) => JSX.Element)[] } => ({
  decorators: [
    (Story: StoryFn): JSX.Element => {
      useEffect((): (() => void) => {
        if (commentary !== null) useCommentaryStore.getState().setCommentary(commentary)
        return (): void => { useCommentaryStore.setState({ commentary: null }) }
      }, [])
      return <Story />
    },
  ],
})

const meta: Meta<typeof CommentaryWidget> = {
  title: 'Widgets/CommentaryWidget',
  component: CommentaryWidget,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof CommentaryWidget>

export const Loading: Story = { ...withCommentary(null) }
export const WithCommentary: Story = {
  ...withCommentary({
    text: 'ETH/USDC gained 1.35% in the last hour, trading above its hourly average of $2,310.00. ETH/USDT and ETH/BTC show similar momentum.',
    generatedAt: new Date().toISOString(),
    pairs: ['ETH/USDC', 'ETH/USDT', 'ETH/BTC'],
  }),
}
