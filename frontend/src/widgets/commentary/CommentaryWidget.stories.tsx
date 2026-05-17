import type { Meta, StoryObj } from '@storybook/react'
import { CommentaryWidget } from './CommentaryWidget'
import { withCommentary } from '@test-utils/storybook.decorators'
import { MOCK_COMMENTARY } from '@test-utils/fixtures'

const meta: Meta<typeof CommentaryWidget> = {
  title: 'Widgets/CommentaryWidget',
  component: CommentaryWidget,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof CommentaryWidget>

export const Loading: Story = { ...withCommentary(null) }
export const WithCommentary: Story = { ...withCommentary(MOCK_COMMENTARY) }
