import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, waitFor } from '@storybook/test'
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

export const Loading: Story = {
  ...withCommentary(null),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('commentary-loading')).toBeInTheDocument()
    await expect(canvas.getByText('Commentary generates every hour...')).toBeInTheDocument()
  },
}

export const WithCommentary: Story = {
  ...withCommentary(MOCK_COMMENTARY),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByTestId('commentary-text')).toBeInTheDocument())
    await expect(canvas.queryByTestId('commentary-loading')).not.toBeInTheDocument()
    await expect(canvas.getByText(/Generated at/)).toBeInTheDocument()
  },
}
